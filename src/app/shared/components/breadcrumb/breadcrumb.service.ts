import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IBreadcrumb } from './ibreadcrumb.interface';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Injectable()
export class BreadcrumbService {
  breadcrumbChanged = new Subject<IBreadcrumb[]>();
  customBreadcrumbs: any[];

  constructor(
    private router: Router
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.customBreadcrumbs = undefined;
      }
      if (val instanceof NavigationEnd) {
        this.customBreadcrumbs = undefined;
      }
    });
  }

  changeBreadcrumbs(breadcrumbParams) {
    this.customBreadcrumbs = undefined;
    if (breadcrumbParams.length === 0) {
      return this.customBreadcrumbs = undefined;
    }
    this.customBreadcrumbs = breadcrumbParams;
    this.breadcrumbChanged.next(this.customBreadcrumbs.slice());
  }

  getCustomBreadcrumbs() {
    if (this.customBreadcrumbs === undefined) {
      return undefined;
    } else {
      return this.customBreadcrumbs.slice();
    }
  }
}
