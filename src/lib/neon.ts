/**
 * Server-only Neon access through the linked gateway, with atomic SQL batches.
 * Credentials are read per request; native/direct connection strings are not used.
 *
 * `sql` mimics the @neondatabase/serverless HTTP client surface used across the
 * app: tagged templates, `sql.query(text, params)`, `sql.unsafe(raw)` and
 * `sql.transaction([...])`. One call = one HTTP request (no session state).
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { contextStatements, type DbContext } from "@/lib/db-context";

/**
 * Request-scoped RLS context. Auth middleware runs handlers inside
 * `withDbContext`, and every query then runs in a transaction that first sets
 * `rout.current_user_id` / `rout.workspace_id` with `set_config(..., true)` (= SET LOCAL).
 * Without a context (anonymous, cron) nothing is set, so both read as null.
 */
const dbContext = new AsyncLocalStorage<DbContext>();
export function withDbContext<T>(ctx: DbContext, fn: () => T): T {
  return dbContext.run(ctx, fn);
}
function activeContext(): Statement[] {
  const ctx = dbContext.getStore();
  return ctx ? contextStatements(ctx) : [];
}

const GATEWAY_URL = "https://connector-gateway.lovable.dev/neon/sql";

type Row = Record<string, unknown>;
type Statement = { query: string; params: unknown[] };
type GatewayResult = { rows: Row[]; rowCount: number | null; command: string };

/** Runtime exclusively uses the linked Neon gateway; owner connections fail closed. */
export function hasDatabase(): boolean {
  return Boolean(process.env["NEON_API_KEY"] && process.env["LOVABLE_API_KEY"]);
}
export function databaseTransport(): "gateway" | "none" {
  return hasDatabase() ? "gateway" : "none";
}

export const RUNTIME_ROLE_GUARD = `do $guard$
begin
  if current_user <> 'rout_app' or exists (
    select 1 from pg_roles where rolname = current_user and (rolbypassrls or rolsuper)
  ) or exists (
    select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname in ('public','neon_auth') and c.relkind in ('r','p')
      and pg_has_role(current_user, c.relowner, 'USAGE')
  ) then
    raise exception 'runtime_role_unsafe' using errcode = '42501';
  end if;
end $guard$`;

function gatewayHeaders(): Record<string, string> {
  const lovable = process.env["LOVABLE_API_KEY"];
  const connection = process.env["NEON_API_KEY"];
  if (!lovable || !connection) {
    throw new Error("No database configured: link a rout_app Neon connector (NEON_API_KEY + LOVABLE_API_KEY); DATABASE_URL is not used.");
  }
  return {
    Authorization: `Bearer ${lovable}`,
    "X-Connection-Api-Key": connection,
    "Content-Type": "application/json",
  };
}

async function post(body: unknown): Promise<any> {
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: gatewayHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any = {};
  try {
    json = JSON.parse(text);
  } catch {
    /* non-JSON body */
  }
  if (!res.ok) {
    const err = new Error(`Neon ${res.status}${json?.code ? ` ${json.code}` : ""}: ${json?.message ?? text.slice(0, 300)}`) as Error & {
      code?: string;
      status?: number;
    };
    err.code = json?.code;
    err.status = res.status;
    throw err;
  }
  return json;
}

/** Normalise params: objects/arrays of objects go as JSON text for json(b) columns. */
function normaliseParams(params: unknown[]): unknown[] {
  return params.map((p) => (p instanceof Date ? p.toISOString() : p === undefined ? null : p));
}

export async function runQuery(query: string, params: unknown[] = []): Promise<GatewayResult> {
  const [result] = await runBatch([{ query, params }]);
  if (!result) throw new Error("Neon returned no statement result");
  return result;
}

/** One gateway request is one PostgreSQL transaction, never an interactive callback. */
export async function runBatch(
  input: Statement[],
  opts: { withContext?: boolean } = {},
): Promise<GatewayResult[]> {
  for (const statement of input) {
    if (TRANSACTION_CONTROL.test(statement.query)) throw new Error("interactive_transactions_unsupported: use one atomic PostgreSQL batch");
  }
  const prefix = [
    ...(opts.withContext === false ? [] : activeContext()),
    { query: RUNTIME_ROLE_GUARD, params: [] },
  ];
  const json = await post({
    queries: [...prefix, ...input].map(s => ({ query: s.query, params: normaliseParams(s.params) })),
  });
  if (!Array.isArray(json.results) || json.results.length !== prefix.length + input.length) {
    throw new Error("Invalid Neon transaction response");
  }
  return json.results.slice(prefix.length);
}

export const withPostgresTransaction = runBatch;
const TRANSACTION_CONTROL = /^\s*(?:begin|commit|rollback|start\s+transaction|end|savepoint|release\s+savepoint)\b/i;

/** Lazy query: executes when awaited, or as part of `sql.transaction([...])`. */
class LazyQuery implements PromiseLike<Row[]> {
  constructor(readonly statement: Statement) {}
  private exec?: Promise<Row[]>;
  run(): Promise<Row[]> {
    this.exec ??= runQuery(this.statement.query, this.statement.params).then((r) => r.rows);
    return this.exec;
  }
  then<A = Row[], B = never>(
    onfulfilled?: ((value: Row[]) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
  ): Promise<A | B> {
    return this.run().then(onfulfilled, onrejected);
  }
  /** Promise compatibility: `sql\`...\`.catch()` must work like a real promise. */
  catch<B = never>(onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null): Promise<Row[] | B> {
    return this.run().catch(onrejected);
  }
  finally(onfinally?: (() => void) | null): Promise<Row[]> {
    return this.run().finally(onfinally);
  }
}

class RawSql {
  constructor(readonly text: string) {}
}

function buildTemplate(strings: TemplateStringsArray, values: unknown[]): Statement {
  let query = "";
  const params: unknown[] = [];
  strings.forEach((chunk, i) => {
    query += chunk;
    if (i < values.length) {
      const v = values[i];
      if (v instanceof RawSql) query += v.text;
      else {
        params.push(v);
        query += `$${params.length}`;
      }
    }
  });
  return { query, params };
}

type SqlTag = {
  (strings: TemplateStringsArray, ...values: unknown[]): LazyQuery & Promise<any[]>;
  query(text: string, params?: unknown[]): LazyQuery & Promise<any[]>;
  unsafe(text: string): any;
  transaction(queries: PromiseLike<unknown>[]): Promise<any[][]>;
};

function makeSql(): SqlTag {
  const tag = ((strings: TemplateStringsArray, ...values: unknown[]) =>
    new LazyQuery(buildTemplate(strings, values))) as unknown as SqlTag;
  tag.query = (text: string, params: unknown[] = []) => new LazyQuery({ query: text, params }) as never;
  tag.unsafe = (text: string) => new RawSql(text);
  tag.transaction = async (queries) => {
    const statements = queries.map((q) => {
      if (!(q instanceof LazyQuery)) throw new Error("sql.transaction expects queries created by sql`` or sql.query()");
      return q.statement;
    });
    const results = await runBatch(statements);
    return results.map((r) => r.rows);
  };
  return tag;
}

export const sql: SqlTag = makeSql();

/** Drop-in for `neon(url)` from @neondatabase/serverless: the URL is ignored, the active transport is used. */
export function neon(_connectionString?: string): SqlTag {
  return sql;
}

/** Better Auth must never receive a successful fake BEGIN/COMMIT. */
export class GatewayPool {
  async query(text: string | { text: string; values?: unknown[] }, values?: unknown[]) {
    const q = typeof text === "string" ? text : text.text;
    const p = typeof text === "string" ? (values ?? []) : (text.values ?? values ?? []);
    if (TRANSACTION_CONTROL.test(q)) {
      throw new Error("interactive_transactions_unsupported: use a reviewed PostgreSQL function or atomic batch");
    }
    const r = await runQuery(q, p);
    return { ...r, fields: [] };
  }
  async connect(): Promise<never> {
    throw new Error("interactive_transactions_unsupported: Better Auth requires a reviewed gateway-compatible adapter");
  }
  async end() {}
  on() { return this; }
}
