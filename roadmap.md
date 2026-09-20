# Roadmap

## Firebase integration (in progress)
- [x] Add firebase 12.18.0 dependency
- [x] `firebase-config` backend function serving the public web config
- [x] `src/lib/firebase.ts` single-init bootstrap (app, auth, database, analytics)
- [x] `src/lib/firebaseUsers.ts` auth + `users/` profile sync (19-char id mapping)
- [x] `src/lib/firebaseFeedback.ts` feedback create/read per rules
- [x] Store wiring: link Firebase identity on login/register, sign out on logout
- [ ] Feedback page: subject field + Firebase write with explicit error handling
- [ ] Database rules file committed at repo root + documented conflicts
- [ ] Build/lint/test verification

## New requirements (from follow-up notes)
- [x] Google SSO sign-in (Firebase Google provider) on login
- [x] Seed at least 10 records per data set (10 users, 10 vendors, 16 menu items, 12 orders, 10 feedback, 12 logs)
- [x] Supplied sample accounts wired in (2 admin, 3 vendor, 4 standard, 1 student) with username/e-mail/User ID login
- [x] User settings page (profile + language preference)
- [x] Multi-language support: English + Afrikaans
- [x] Invalid input handling: empty/wrong credentials rejected, offline API fallback
- [ ] Update README + documentation/

