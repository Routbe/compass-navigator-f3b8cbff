# Repository import
- [x] Import source, styles, assets, and dependencies safely.
- [x] Verify public QR generation, download, and phone navigation.
- [ ] Original accounts, data, payments, and integrations: blocked by missing original services and credentials.
- [x] Link the existing Neon connection to this project.

## ROUT hardening handoff
- [ ] Apply immutable Neon migrations 0146, 0147, 0148 in order after checking live state; verify schema snapshot.
- [ ] Switch app runtime to least-privilege rout_app through the Neon connector; verify RLS preflight.
- [ ] Verify email freeze/unfreeze with a disposable account.
- [ ] Connect and verify existing Scaleway storage.
- [ ] Verify real passkey/PRF ledger flow.
- [ ] Resolve remaining accessibility warnings and run existing tests.
