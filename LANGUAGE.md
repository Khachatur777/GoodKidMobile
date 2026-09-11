# Language feature

Branch `feature/language`, based on `main`. All builds in this branch use the dev API and its media origin, including release tests. Live `main` is unchanged.

- Learn → Language: listen, build the word from distinct letter tiles, check, retry, skip, resume, and finish for stars.
- Child profile → Language: choose English/Russian/Armenian, word length 2–12, and view attempts/results from the last three days.
- Interface copy supports English, Russian and Armenian and uses the app's current theme.
- Needs the matching backend feature deployed to `apidev.goodkid.app`.

New files pass ESLint; Metro bundles were built for iOS and Android. The repository-wide TypeScript check has existing errors outside this feature. Native-device QA should follow the dev deployment.
