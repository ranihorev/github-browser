# Github Repo Browser

Browse public Github repositories of users and review the repo's commits 

## Try it out

Check it out on https://github-browser.onrender.com/

## Getting started

1. Make sure that node.js and yarn are installed
2. Run `yarn`
3. Run `yarn start` for dev mode or `yarn start:watch` for watch mode
4. Go to `localhost:3000`
5. Run `yarn build` to build the app in production mode

## TODOs:

- Add repo description to commits view
- Better handling of rate limit 
- Add page and sorting to url params
- Link to author in commits view
- Filters & search
- New feature: Branch view + view branch commits
- Better error messages
- Column resizing
- Replace pagination with infinite scroll
- Review bundle size

## Tests

There are no tests at the moment, and most of the tests were done manually, by testing different users and repos (including invalid inputs).
The UI is pretty simple and the most important to test in my opinion is the interface with Github, such as handling rate limiting.
To test the app without interacting with Github, set `REACT_APP_USE_FAKE_DATA=1` in `.env.development.local` and re-run the dev server. 

