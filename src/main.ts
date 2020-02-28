import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppBrowserModule } from './app/app-browser.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if (console && console.log) {
    console.log = function () {};
  }
}

const bootstrapPromise =  platformBrowserDynamic().bootstrapModule(AppBrowserModule, { preserveWhitespaces: true });

// Logging bootstrap information
bootstrapPromise.then((success) => {
    console.log(`Bootstrap success`);
    if ('serviceWorker' in navigator && environment.production && navigator.serviceWorker && !navigator.serviceWorker.controller) {
      navigator.serviceWorker.register('/ngsw-worker.js');
    }
  })
  .catch(err => console.error(err));
