# ROUT repository import

Source: https://github.com/Routbe/compass-navigator-1876626b.git, archive HEAD bad9e406. Permission confirmed.

Imported repository code directly, not the GitHub website. No deployed source URL supplied; source/preview visual and motion parity unverified. No static media replacements or normal-flow panel rewrites. Existing services and database were not copied or migrated; source .env and Git/project metadata excluded. Destination Cloud integrations preserved.

| Route | Viewport | Control | Result | Status |
| --- | --- | --- | --- | --- |
| / | 1280×1800 | URL input | QR visible for https://example.com/compass-import/verified | Passed |
| / | 1280×1800 | Download | PNG downloaded, 87759 bytes | Passed |
| / | 1280×1800 | Frame | Existing options open | Passed |
| / | 1280×1800 | Wheel scroll | Footer visible | Passed |
| / | 390×844 | URL input | QR visible, no horizontal overflow | Passed |
| / | 390×844 | Menu | Settled panel visible; Open Source & Docs navigates to /self-hosting | Passed |
| Authenticated pages | Both | Accounts, saved data, payments, uploads | Original database and service credentials absent | Blocked |

Evidence: /tmp/browser/compass-import. No browser runtime exceptions. Manual tsgo succeeded; 12 targeted route/mode tests passed. Automatic build log reports no build errors with automatic typecheck timeout.
