# Kanjibenkyo: Refactoring Plan

This plan covers security issues, bugs, platform end-of-life problems and refactoring work for Kanben. The repository has not changed since February 2020, so most of the stack is out of date.

Items are grouped by priority:

| Priority | Meaning |
|----------|---------|
| **P0** | Security or data exposure. Fix before anything else, even before the app is used by new people. |
| **P1** | Bugs users can hit today, or data integrity problems. |
| **P2** | Dependencies and platforms that are end-of-life or unmaintained. They block further development. |
| **P3** | Backend refactor: structure, API contract, data model. |
| **P4** | Frontend refactor: code quality, typing, state handling. |
| **P5** | Tests, CI, tooling, docs and polish. |

Within each priority, the order of the items is roughly the order to do them in.

> Basis: this plan comes from reading the code only. The app was not run and the Firebase and MongoDB configuration could not be inspected. Items marked **(verify)** need a check in the Firebase console or the MongoDB Atlas dashboard.

---

## P0: Security and data exposure

- [ ] **Audit the Firebase Realtime Database rules (verify).** The server calls `pyrebase` without any auth token, so it reads and writes as an anonymous client. Unless the rules are restricted, anyone with the public web API key can probably read or write the `users` node. The rules are not in this repo. Check them in the console first, then lock them down so only the server (via the Admin SDK) and each user's own data are accessible.
- [ ] **Authenticate the progress endpoint.** `POST /user/kanji/new` takes `email` from the request body and writes to that user's record. There is no token check, so anyone can overwrite any user's `kanji_known`. Fix: require the Firebase ID token in the `Authorization` header, verify it server-side with `firebase_admin.auth.verify_id_token`, and take the user ID from the token. Ignore the email in the body.
- [ ] **Validate `kanji_known` on write.** Accept only characters that appear in the kanji dataset, de-duplicate them, and cap the length. Right now any string is stored.
- [ ] **Fix regex injection in `/dictionary/sentence/<kanji>`.** The path value is passed straight into a MongoDB `$regex`. Input such as `.*` or a long catastrophic pattern causes full scans or ReDoS. Fix: validate that the input is one Japanese character (or a short string of them), then match it literally (escape it, or use `$contains`-style matching with a literal).
- [ ] **Whitelist the `level` parameter.** `db[level]` in `/kanji/<level>` turns any path segment into a collection name in the `kanji` database. Only `n1` to `n5` should be accepted.
- [ ] **Remove `console.log(form)` from `login.component.ts`.** It logs the whole form, including the password. Also remove the other `console.log` calls in `kanji-card.component.ts`.
- [ ] **Move secrets out of `config.py` into environment variables.** `Server/initialization/config.py` holds the MongoDB connection string and the Firebase config. The file is git-ignored and I found no secrets in git history, which is good. Still, read the values from `os.environ`, add a `.env.example` with the variable names, and rotate the MongoDB password if it has been shared outside this machine.
- [ ] **Stop sending Firebase tokens to the browser where it is not needed.** `login` and `signup` return `idToken` and `refreshToken`, and the client keeps the whole response in `loginInfo`. Use a server-side session instead: create a Firebase session cookie with the Admin SDK and send it as `HttpOnly`, `Secure`, `SameSite=Lax`. This also fixes P1 "session lost on reload".
- [ ] **Rate-limit `/user/login` and `/user/signup`** (for example Flask-Limiter). The routes have no limit, so they can be brute-forced.
- [ ] **Add security headers** (Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy). `flask-talisman` covers most of this.
- [ ] **Fix the CORS origin list.** `main.py` lists `'localhost:4200'`, `'firebaseapp.com'` and so on, with no scheme. Browsers send origins with a scheme (`https://...`), so these entries will not match. Decide which origins really need access. If the Angular app and the API are served from the same host (as the README describes), CORS may not be needed at all, so remove it.
- [ ] **Stop returning raw error text as a 200 response.** This is a security concern because it makes errors indistinguishable from success. See P3 for the new error format.

## P1: Bugs and data integrity

- [ ] **Account DB keys collide.** `util.get_user` builds the key from the email by joining the parts before `@` with the dots removed, and it stops at the first dot after `@`. Results:
  - `john.doe@gmail.com` and `johndoe@gmail.com` both map to `johndoe@gmail`.
  - `a@gmail.com` and `a@gmail.de` both map to `a@gmail`.

  Two users can share progress. Fix: key the record by Firebase `uid`. Write a one-off migration for existing records (see the migration checklist at the end).
- [ ] **Progress update reports success on failure.** The server returns `{'error': ...}` with HTTP 200, and `KanjiService.updateKnownList` in `kanji-card.component.ts` treats any truthy response as success, so the kanji is marked as studied even when the save failed. `markKanji` also changes local state before the server confirms, and there is no error callback, so `isLoading` stays `true` forever.
- [ ] **Login and signup error messages are wrong.** In `login.component.ts` and `signup.component.ts`, the `switch` has no `break`. Every error falls through to the last `case`, so users see the wrong-password message for every failure. Signup pushes several messages at once. Replace the switch with a lookup map.
- [ ] **Signup is not atomic.** The Firebase user is created before the database record. If the database write fails, the account exists with no progress record, and the next login fails. Fix: create the record lazily (default to an empty list when it does not exist), or create it in the same flow with a rollback.
- [ ] **Login crashes when the progress record is missing.** `user_data.val()['kanji_known']` raises `TypeError` when `val()` returns `None`. That is not caught (only `HTTPError` and `ConnectionError` are), so the request returns a 500 and the login page spins forever.
- [ ] **Unknown kanji crash the card page.** `getKanji` returns an empty list for an unknown kanji, and `kanji-card.component.ts` does `data.data[0]` without checking, so the page breaks. Return 404 from the server, and show a message in the client.
- [ ] **Example phrases break at the end of the list.** In `getExamplePhrase`, `curPhraseIndex` goes up with no bounds check, so the button crashes after the last phrase. An empty result crashes on `data.data[0].text`.
- [ ] **Storage format for `kanji_known` is inconsistent.** Signup saves `""` to the database but sets `" "` in the client. The progress is a string, so `.length` and `.includes` count characters. Store it as an array of kanji.
- [ ] **Double-clicking "Mark it as studied" duplicates the kanji.** `markKanji` concatenates without checking for an existing entry. `unmarkKanji` uses `.replace`, which removes only the first occurrence. Both are fixed by the array format above, plus a guard.
- [ ] **Session is lost on reload.** `LoginService` keeps everything in memory, so a page refresh logs the user out even though progress is saved on the server. Fixed by the session cookie item in P0.
- [ ] **`/level` route mismatch.** Flask serves `/level`, but the Angular router has no matching route, so the user lands on the 404 page. Add a redirect to `/home` or remove the route from `main.py`.
- [ ] **Invalid request header in `HttpService`.** `headers` sets `Access-Control-Allow-Origin` as a request header, which is not valid. It also sets `Content-Type: application/json` on GET requests, which forces an unnecessary CORS preflight. Remove both.
- [ ] **Hard-coded values in the home page.** `sidebar.component.ts` has `logged: boolean = true` and a fixed `dailyKanji`. Check whether `app-sidebar` is rendered. If it is, wire it to real data. If not, delete it.

## P2: Dependencies and platform (end-of-life and unmaintained)

- [ ] **Angular 8 is end-of-life.** The project uses Angular 8.2, TypeScript 3.5 and `@types/node` 8.9. Upgrading one major version at a time means roughly a dozen `ng update` steps, and each one needs fixes. **Recommended:** create a new Angular project on a current version (standalone components) and port the components, keeping the same routes and the same API contract. Only do the step-by-step upgrade if you need the existing code to keep running during the rewrite.
- [ ] **Replace Protractor, Karma and tslint.** The Angular CLI stopped generating Protractor setups in version 12, and tslint is deprecated in favour of ESLint. Use ESLint (or the Angular ESLint package), Vitest or the Angular default test runner for unit tests, and Playwright for end-to-end tests.
- [ ] **Move to Bootstrap 5.** Bootstrap 4 is no longer supported. Bootstrap 5 does not need jQuery or Popper 1.x (it bundles Popper 2). The About page uses Bootstrap's collapse JavaScript, so check that part when porting.
- [ ] **Replace `pyrebase`.** It is unmaintained and was built on older `requests`. Use the official `firebase-admin` package for the server side. Put the Firebase client SDK in the browser only if the front end needs direct access.
- [ ] **Replace `flask_restful`.** It is largely unmaintained, and `api = Api(app)` is never used. Plain Flask routes (or blueprints) are enough. Remove unused imports: `Resource`, `MethodView`, `json`, `jsonify`, `Response`.
- [ ] **Pin the Python version and the dependencies.** `requirements.txt` has no versions. Pick a current Python (3.12 or newer), add `.python-version`, pin exact versions with `uv` or `pip-tools`, and run `pip-audit`.
- [ ] **Fix hosting.** Heroku's free dynos ended in 2022, so the Procfile will not run there without a paid plan. Choose a host (Render, Fly.io, Railway, Cloud Run, or another) and update the deployment notes. The Procfile also has a bug: `gunicorn main:app runserver 0.0.0.0:5000` passes `runserver 0.0.0.0:5000` to Gunicorn as extra arguments, which Gunicorn will most likely reject at startup (not tested here). Use `gunicorn main:app --bind 0.0.0.0:$PORT`.
- [ ] **Pin Node.js and the Angular build tooling.** Use a current LTS version, and add `.nvmrc`.
- [ ] **Decide the database.** The Realtime Database works, but Firestore is the current default for new Firebase projects and has better querying and security rules. Migrating is optional, so decide it after P0 and P1 are done.

## P3: Backend refactor

- [ ] **Split `main.py` into modules.** Use an app factory (`create_app()`) and blueprints: `pages`, `kanji`, `sentences`, `auth`, `progress`. Keep the database clients and Firebase setup in their own module.
- [ ] **Use one error format and real HTTP status codes.** Return 400 for bad input, 401 for missing or invalid token, 404 for an unknown kanji or level, 409 for an existing email, and 500 for internal errors, all with `{"error": {"code": "...", "message": "..."}}`. Update the client to match.
- [ ] **Validate input on every route.** Use `pydantic` or `marshmallow` for signup, login and progress updates. The current code reads `request.get_json()` and indexes keys directly, so a missing key causes a 500.
- [ ] **Key user data by uid.** Store progress under `users/{uid}` with `kanji_known` as a list. Remove the `util.get_user` email transform.
- [ ] **Fix the MongoDB client settings.** `maxPoolsize=1` makes every query wait for the one before it. `socketTimeoutMS=None` means a stuck query waits forever. Use the default pool size and set reasonable timeouts.
- [ ] **Make sentence search fast and deterministic.** The `$regex` query scans the whole collection, and `.limit(20)` has no `sort`, so results change between requests. Add an index suited to the query (or a precomputed map from kanji to sentence IDs) and sort the results.
- [ ] **Move the dataset into a repeatable import.** The kanji and sentence data is loaded into MongoDB by hand, which is not written down anywhere. Add a script under `Server/scripts/` that imports both datasets, with the source and licence recorded (see the README).
- [ ] **Add structured logging and a health route.** `GET /healthz` is needed for hosting checks. Log errors with the request ID.
- [ ] **Tune Gunicorn.** Set `--workers`, `--timeout` and `--access-logfile` in the Procfile or a `gunicorn.conf.py`.
- [ ] **Delete dead code.** After the migration, remove `initialization/util.py`, the `initialization` package and the unused imports.

## P4: Frontend refactor

- [ ] **Stop using `params['_value']`.** It is a private API. Use `paramMap` observables (or the `snapshot` value where the route does not change) in `kanji-list` and `kanji-card`.
- [ ] **Type the models.** Create interfaces for `Kanji`, `Sentence`, `Level`, `UserSession` and `Progress`. Replace `any` and `object` in `http.service.ts`, `login.service.ts`, `kanji.service.ts` and the components.
- [ ] **Use `string[]` for `kanji_known`.** Use `Set` where the code checks membership.
- [ ] **Put the level thresholds in one place.** `KanjiService.getKanjiLevelList` uses magic numbers (`79`, `245`, `603`, `970`, `2202`) and sets `curMaxLevel` in several places. Move them to one constant, and add a unit test for each threshold.
- [ ] **Remove unused parameters.** `KanjiService.getKanjiPhrases` computes `curLevel` and never uses it.
- [ ] **Remove duplicated code.** The login and signup error handling and the form-reset logic repeat across the two components. Move them to a shared helper.
- [ ] **Use the environment files for the API base URL.** `HttpService` hard-codes the production URL, while `environment.ts` and `environment.prod.ts` exist and are unused.
- [ ] **Add a route guard for the logged-in pages.** Each template repeats `*ngIf="loginService.logged; else: unauthorized"`. A guard on the `level/*` routes is one place to maintain.
- [ ] **Use the session from the server.** After the cookie-based session in P0, `LoginService` should ask the server who is logged in when the app starts, instead of relying on memory.
- [ ] **Remove dead components and mock data.** Check whether `app-sidebar`, `app-not-logged` and `app-logged` are used, and delete any that are not.
- [ ] **Fix the typos in the About page.** Examples: "Proeficiency", "undestandings", "usign", "Beign", "unfortunatelly", "Jisho.org" link text. Read the whole page again, since these are user-facing.
- [ ] **Check accessibility basics.** Form labels, button text, colour contrast on the kanji cards (studied and not studied), and keyboard navigation through the level list.

## P5: Tests, CI, tooling and docs

- [ ] **Replace the default e2e spec.** `Client/e2e/src/app.e2e-spec.ts` expects the text `kanjibenkyo app is running!`, which is not in the app, so it fails. Replace it with a smoke test: home loads, level list loads, login error shows the correct message.
- [ ] **Add unit tests for the logic that matters.**
  - Backend: `pytest`, with an in-memory or test MongoDB, and the Firebase emulator for auth.
  - Frontend: `KanjiService.getKanjiLevelList` thresholds, the error mapping, and the phrase navigation bounds.
- [ ] **Test the bugs in P1.** Write a failing test for each one before fixing it.
- [ ] **Add CI (GitHub Actions).** Run the backend tests, the frontend lint, tests and build, `pip-audit`, and `npm audit`.
- [ ] **Turn on Dependabot** for `pip` and `npm`.
- [ ] **Set up formatting.** Black for Python and Prettier for TypeScript. `.editorconfig` already exists.
- [ ] **Add error tracking** (for example Sentry) to the backend and the frontend.
- [ ] **Update the README** after each phase: setup, environment variables, the new API error format, and deployment.

---

## Suggested order

1. **P0 in full** before any new user signs up. The progress endpoint and the database rules are the most urgent items.
2. **P1 bugs that touch data** (account keys, progress saving, signup atomicity), with a migration.
3. **P2 platform**: decide the frontend rewrite and the new host. Set up CI first so the rewrite is tested from the start.
4. **P3 and P4** as part of the rewrite, module by module.
5. **P5** alongside each step, not at the end.

## Migration checklist (user data)

- [ ] Export the current `users` node from Firebase as a backup before changing anything.
- [ ] For each record, find the Firebase Auth user by email and map it to the `uid`. Report any email that maps to more than one record (the collision bug).
- [ ] Convert `kanji_known` from a string to an array, dropping spaces.
- [ ] Run the migration in a staging project first.
- [ ] After the migration, keep the old node read-only for one release, then delete it.

## Open questions

- Rewrite the frontend on a current Angular, or upgrade the existing code one major version at a time?
- Which host should the app move to?
- Keep Firebase Realtime Database, or move to Firestore?
- Do existing users need their progress kept, or is a reset acceptable?
- Is the sidebar and the "Last viewed kanji" card still wanted?
