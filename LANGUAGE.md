# Language feature

Production branch `main`. Builds use the production API by default; development can explicitly enable RN_APP_USE_DEV_API for debug builds.

- Learn → Language: listen, build the word from distinct letter tiles, check, retry, skip, resume, and finish for stars.
- Child profile → Language: choose English/Russian/Armenian, word length 2–20, and view attempts/results from the last three days.
- Interface copy supports English, Russian and Armenian and uses the app's current theme.
- Needs the matching backend deployed to `api.goodkid.app`.

New files pass ESLint; Metro bundles were built for iOS and Android. The repository-wide TypeScript check has existing errors outside this feature. Native-device QA should follow the dev deployment.
