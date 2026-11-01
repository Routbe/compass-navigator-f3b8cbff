# Repository import
- [x] Import source, styles, assets, and dependencies safely.
- [x] Verify public QR generation, download, and phone navigation.
- [ ] Original accounts, data, payments, and integrations: blocked by missing original services and credentials.
- [x] Link the existing Neon connection to this project.

## ROUT hardening handoff
- [x] Apply immutable Neon migrations 0146, 0147, 0148 in one transaction and verify recorded checksums.
- [ ] Reach zero schema drift: blocked by three overbroad rout_app table grants and whitespace-only function definition difference; no grants/snapshot repair approved.
- [ ] Switch app runtime to rout_app: blocked by available connection still using neondb_owner; needs a separate rout_app connection.
- [ ] Verify email freeze/unfreeze: blocked by missing reviewed recovery design, disposable signed-in account and mail configuration.
- [ ] Connect and verify existing Scaleway storage: requires existing credentials and bucket configuration.
- [ ] Verify real passkey/PRF ledger flow: requires a real authenticator and disposable signed-in account.
- [x] Resolve all current jsx-a11y findings; 1,234 tests pass; QR keyboard interaction verified.
- [ ] Other pre-existing lint findings (10,226) remain outside the accessibility repair scope.
