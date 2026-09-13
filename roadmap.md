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
- [ ] Google SSO sign-in (Firebase Google provider) on login/signup
- [ ] Seed at least 10 records per data set (users, vendors, menu, orders, feedback, logs)
- [ ] User settings page (profile + language preference)
- [ ] Multi-language support: English + Afrikaans
- [ ] Invalid input handling / no crashes; app compiles and runs clean
- [ ] Update README + documentation/
