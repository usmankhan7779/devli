// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  environment: 'dev',
  api_url: 'https://staging-api.lineups.com',
  stripe: {
    key: 'pk_test_gCyw0Cd1MoCq43er7CJe8Nb6'
  },
  pusher: {
    key: '8dc9f7b046aec857def3'
  },
  firebase: {
    apiKey: 'AIzaSyD_J2gkbA-bRRls8aVoOrHolD_yJ1dV8mA',
    authDomain: 'lineups-ae6f5.firebaseapp.com',
    databaseURL: 'https://lineups-ae6f5.firebaseio.com',
    projectId: 'lineups-ae6f5',
    storageBucket: 'lineups-ae6f5.appspot.com',
    messagingSenderId: '233505510529'
  },
  sentryUrl: 'https://dcec63032b814fe5b0f4eac73520c284@sentry.io/1376509',
  iflychat: {
    id: 'edc2645b-7e8b-43d5-9b0d-0b9f1a11ad93'
  }
};
