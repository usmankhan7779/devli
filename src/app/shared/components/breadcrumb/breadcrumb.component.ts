
import {filter} from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';

import {BreadcrumbService} from './breadcrumb.service';
import { Subscription } from 'rxjs';
import { IBreadcrumb } from './ibreadcrumb.interface';
import * as _ from 'lodash';
import { CommonService } from '../../services/common.service';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() allowParams = false;
  @Output() performActionOnClick = new EventEmitter();
  breadcrumbChangesSubscription: Subscription;
  _breadcrumbs: IBreadcrumb[];

  hideHomeBR = false;

  get breadcrumbs(): IBreadcrumb[] {
    return this._breadcrumbs;
  }

  set breadcrumbs(val) {
    this._breadcrumbs = val;
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': []
    };
    this._breadcrumbs.forEach((breadcrumb, i) => {
      schema.itemListElement.push({
        '@type': 'ListItem',
        'position': i + 1,
        'item': {
          '@id': this.setSchemaUrl(breadcrumb.url),
          'name': breadcrumb.label
        }
      });
    });
    if (this._breadcrumbs.length) {
      this.schemaService.addSchema(schema, true);
    }
  };

  initialized = false;
  isIframe: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService,
    private schemaService: SchemaService
  ) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    this.isIframe = this.commonService.openedInIframe();
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    if (!this.initialized) {
      const initRoot: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(initRoot);
    } else {
      // subscribe to the NavigationEnd event
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
        // set breadcrumbs
        const root: ActivatedRoute = this.activatedRoute.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
      });
    }
    this.breadcrumbChangesSubscription = this.breadcrumbService.breadcrumbChanged
      .subscribe((breadcrumbs: IBreadcrumb[]) => {
        this.breadcrumbs = breadcrumbs;
      });
  }

  onBreadcrumbClick(breadcrumbItem) {
    this.performActionOnClick.emit(breadcrumbItem);
  }

  ngOnDestroy() {
    if (this.breadcrumbChangesSubscription) {
      this.breadcrumbChangesSubscription.unsubscribe();
    }
  }

  setSchemaUrl(url) {
    let _url;
    if (url === './') {
      _url = this.router.url;
    } else {
      _url = url;
    }
    if (url.indexOf('www.lineups.com') !== -1) {
      return url;
    }
    return 'https://www.lineups.com' + _url;
  }

  setUrl(breadcrumb) {
    const arr = [breadcrumb.url];
    if (this.allowParams && breadcrumb.params && !_.isEmpty(breadcrumb.params)) {
      arr.push(breadcrumb.params);
    }
    return arr;
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // get the child routes
    const children: ActivatedRoute[] = route.children;
    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    // iterate over each children
    for (const child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET || child.snapshot.data[ROUTE_DATA_BREADCRUMB] === null ||
        child.snapshot.data[ROUTE_DATA_BREADCRUMB] === 'none') {
        this.includeCustomBreadcrumbs(breadcrumbs);
        this.hideHomeBR = child.snapshot.data[ROUTE_DATA_BREADCRUMB] === 'none';
        continue;
      }

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // get the route's URL segment
      let routeURL: string;
      if (child.snapshot.url.length === 0) {
        routeURL = child.parent.snapshot.url.map(segment => segment.path).join('/');
      } else {
        routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      }

      // append route URL to URL
      url += `/${routeURL}`;

      // add breadcrumb
      const breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);
      // If there are custom breadcrumbs, include them
      this.includeCustomBreadcrumbs(breadcrumbs);
      // recursive
      return this.getBreadcrumbs(child, url,_.uniqBy(breadcrumbs, 'label'));
    }

    // we should never get here, but just in case
    return breadcrumbs;
  }

  private includeCustomBreadcrumbs(breadcrumbs) {
    if (this.breadcrumbService.getCustomBreadcrumbs() !== undefined) {
      const customBreadcrumbs = this.breadcrumbService.getCustomBreadcrumbs();
      customBreadcrumbs.forEach(customBC => {
        breadcrumbs.push(customBC);
      });
    }
  }

}
