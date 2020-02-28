import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { BrowserTransferStateModule } from '../modules/transfer-state/browser-transfer-state.module';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({
  imports: [
    // appId must match Server NgModule
    BrowserModule.withServerTransition({appId: 'lineup-app-id'}),
    AppModule,
    // HttpTransfer for browse
    BrowserTransferStateModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : []
  ],
  providers: [
  ],
  bootstrap: [ AppComponent ],
})
export class AppBrowserModule { }
