<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Imported application
- Preserve ROUT source structure and file-based routes; regenerate the route tree rather than copying it, so routing remains compatible with this host.
- Keep destination-generated Cloud integrations and hosting configuration; never transplant source environment secrets or project metadata.
- Original Neon/Better Auth and external service modules remain unconfigured until explicitly migrated or securely connected; Cloud enablement alone does not migrate those services.

## ROUT security architecture
- Keep phase-one standard OIDC discovery compatible; pairwise subjects and Sybil nullifiers remain supported, while blind-token protocols belong only to a future separate SDK.
- Keep ledger RSA-OAEP 3072 and AES-256-GCM envelope keys browser-generated; persist only public keys and encrypted envelopes/payloads on the server.
- Keep Neon migration files immutable and numbered; validate grants and snapshots through PGlite replay before any forward-only repair.
- Use a dedicated non-owner rout_app connection for app queries and reserve the owner connection for approved migrations; linking an owner connector does not enforce RLS.
- Enforce jsx-a11y rules with the existing form controls recognized, so false positives do not hide genuine keyboard and ARIA issues.
- Runtime Neon queries use atomic gateway batches with a database role guard; interactive pool transactions are rejected because stateless requests cannot share a session.
- Disclosure audit heads are trigger-managed and read with rows in one snapshot; this detects tail deletion within the database permission boundary, not owner-level rollback or tampering.
