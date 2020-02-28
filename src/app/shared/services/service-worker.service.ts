import { Injectable, Injector } from '@angular/core';
import { CommonService } from './common.service';
import { SwUpdate } from '@angular/service-worker';
import { environment } from 'environments/environment';

@Injectable()
export class ServiceWorkerService {
  private swUpdate;
  constructor(
    private commonService: CommonService,
    private injector: Injector
  ) {
    if (this.commonService.isBrowser() && environment.production) {
      this.swUpdate = this.injector.get(SwUpdate);
      if (this.swUpdate.isEnabled) {
        this.subscribeOnServiceWorkerUpdate();
        this.swUpdate.checkForUpdate();
      }
    }
  }

  private subscribeOnServiceWorkerUpdate() {
    console.log('@@@subscribeOnServiceWorkerUpdate@@@');
    return this.swUpdate.available.subscribe(() => {
      console.log('@@@available@@@');
      this.swUpdate.activateUpdate()
        .then(() => this.openUpdateAvailablePopup());
    });
  }

  private openUpdateAvailablePopup() {

    this.commonService.showNotification(
      'Click update to reload site and see the latest lineup news.',
      'News Update',
      'Update', null, () => {
      window.location.reload();
    });

  }
}
