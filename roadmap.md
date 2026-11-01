# Repository import
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
- [ ] Other pre-existing lint findings (10,226) remain outside the accessibility repair scope.

## Database foundation repair
- [x] Remove fake transactions; keep real atomic SQL batches and reject unsupported interactive Better Auth transactions.
- [ ] Complete Better Auth's gateway-compatible atomic adapter and service/bootstrap paths; current adapter is intentionally fail-closed, not verified working authentication.
- [x] Guard every runtime batch against owner/BYPASSRLS roles and inject canonical transaction-local context into authenticated descriptor/RPC, middleware and signed-session lookup paths.
- [ ] Link actual rout_app connection: the latest selection still returned neondb_owner; unsafe runtime requests are blocked.
- [x] Prepare 0150 protected user audit head, AFTER INSERT advancement, one-snapshot verification and rollback/truncation tests; offline replay passed.
- [ ] Apply 0150/0151 and register verified existing 0149: awaits exact live SQL confirmation; no historical migration rewritten.
- [x] Diagnose avatar 503 as missing configured storage before upload; add sanitized PUT/network/provider and read-failure logging.
- [ ] Live Scaleway cache check: credentials/bucket remain unavailable.
- [x] Full suite: 217 files / 1,240 tests passed; manual TypeScript check exit 0 after host timeout. PGlite proves late-error rollback and context cleanup, not live gateway/auth success.
- [ ] Authenticated end-to-end verification: blocked by owner connection and unsupported Better Auth adapter; JWKS is temporarily unavailable rather than using unsafe owner access.
