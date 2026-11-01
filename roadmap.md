# Repository import
## MDX knowledge graph and credentials directive
- [ ] Configure MDX/frontmatter and four-pillar routing, preserving existing URLs.
- [ ] Build token-based dark docs layout, sidebar, ToC, breadcrumbs, local search stub and previous/next links.
- [ ] Add MDX callouts, highlighted copyable code, actual badge previews, steps and API endpoints.
- [ ] Generate the requested article union; write manifesto, badges and OIDC accurately and fully.
- [ ] Audit session recognition, merging and email webhooks; assess credential hub against existing issuing features without renumbering immutable 0147.
- [ ] Verify pillar HTTP 200, MDX interactions, mobile/desktop, accessibility and full tests.

- [x] Import source, styles, assets, and dependencies safely.
- [x] Verify public QR generation, download, and phone navigation.
- [ ] Original accounts, data, payments, and integrations: blocked by missing original services and credentials.
- [x] Link the existing Neon connection to this project.

## ROUT hardening handoff
- [x] Apply immutable Neon migrations 0146, 0147, 0148 in one transaction and verify recorded checksums.
- [ ] Reach zero live schema drift: 0151 repair prepared and offline replay passed; live execution awaits exact SQL confirmation.
- [ ] Switch app runtime to rout_app: blocked by available connection still using neondb_owner; needs a separate rout_app connection.
- [ ] Verify email freeze/unfreeze: blocked by missing reviewed recovery design, disposable signed-in account and mail configuration.
- [ ] Connect and verify existing Scaleway storage: requires existing credentials and bucket configuration.
- [ ] Verify real passkey/PRF ledger flow: requires a real authenticator and disposable signed-in account.
- [x] Resolve all current jsx-a11y findings; 1,234 tests pass; QR keyboard interaction verified.
- [ ] Other pre-existing lint findings (10,396 errors / 86 warnings) remain outside the accessibility repair scope; current jsx-a11y count is zero.

## Database foundation repair
- [x] Prepare 0152 SQL-only account merge with database-verified ticket/email code, fixed transfers, locked designs/native mappings and a non-login executor; nine PGlite tests include late-error rollback and rout_app isolation.
- [ ] Apply 0152 after 0150/0151: blocked by exact live SQL confirmation and safe rout_app connection; passkey verification remains server-side, live merge/auth not verified.
- [x] Reconcile the compass-navigator-43 handoff without replacing this checkout: 0146–0148 already recorded, zero jsx-a11y findings, four incomplete leaf metadata declarations repaired; handoff test count differs from this checkout.
- [ ] Live schema drift verification: blocked by unsafe runtime connection; current schema-check script has an unguarded migration executor and was not used to bypass runtime security.
- [x] Remove fake transactions; keep real atomic SQL batches and reject unsupported interactive Better Auth transactions.
- [ ] Complete Better Auth's gateway-compatible atomic adapter and service/bootstrap paths; current adapter is intentionally fail-closed, not verified working authentication.
- [x] Guard every runtime batch against owner/BYPASSRLS roles and inject canonical transaction-local context into authenticated descriptor/RPC, middleware and signed-session lookup paths.
- [ ] Link actual rout_app connection: the latest selection still returned neondb_owner; unsafe runtime requests are blocked.
- [x] Prepare 0150 protected user audit head, AFTER INSERT advancement, one-snapshot verification and rollback/truncation tests; offline replay passed.
- [ ] Apply 0150/0151 and register verified existing 0149: awaits exact live SQL confirmation; no historical migration rewritten.
- [x] Diagnose avatar 503 as missing configured storage before upload; add sanitized PUT/network/provider and read-failure logging.
- [ ] Live Scaleway cache check: credentials/bucket remain unavailable.
- [x] Full suite: 220 files / 1,251 tests passed, including complete migration/snapshot replay; manual TypeScript exit 0. Snapshot regenerated only after PGlite replay. Not the handoff's claimed 1,271 tests or live gateway/auth success.
- [ ] Authenticated end-to-end verification: blocked by owner connection and unsupported Better Auth adapter; JWKS is temporarily unavailable rather than using unsafe owner access.

## Preview recovery
- [x] Handle workspace session/database unavailability with an explicit unavailable response; disable scope actions and downstream data loads.
- [x] Serve a non-cacheable first-party avatar placeholder when private image cache storage is unavailable; never bypass the privacy proxy.
- [x] Both reported requests verified through browser: image 200 placeholder, workspace unavailable/no memberships/no role, zero page errors. Twelve relevant tests pass and TypeScript exit 0; signed-in flows remain blocked by prior connection/adapter issues.
