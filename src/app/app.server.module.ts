
import {first, filter} from 'rxjs/operators';
import { NgModule, ApplicationRef, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { ServerTransferStateModule } from '../modules/transfer-state/server-transfer-state.module';
import { TransferState } from '../modules/transfer-state/transfer-state';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServiceWorkerModuleMock } from '../modules/service-worker/service-worker.mock.module';

export function onBootstrap(appRef: ApplicationRef, transferState: TransferState) {
  return () => {
    appRef.isStable.pipe(
      filter(stable => stable),
      first())
      .subscribe(() => {
        transferState.inject();
      });
  };
}


@NgModule({
  imports: [
    // Import our main App NgModule
    AppModule,

    BrowserModule.withServerTransition({
      appId: 'lineup-app-id' // make sure this matches with your Browser NgModule
    }),
    // ServerModule needs to be after our main App NgModule
    ServerModule,
    NoopAnimationsModule,
    // HttpTransfer module
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    ServiceWorkerModuleMock
  ],
  declarations: [
  ],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      multi: true,
      deps: [
        ApplicationRef,
        TransferState
      ]
    }
  ],
  bootstrap: [ AppComponent ],
})
export class AppServerModule { }
