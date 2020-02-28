import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare let ga: Function;

@Injectable()
export class TitleService {
  previousRouteUrl = '';
  constructor(
    private title: Title,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  setTitle(value) {
    this.title.setTitle(value);
    if (isPlatformBrowser(this.platformId) && this.previousRouteUrl !== this.router.url) {
      this.previousRouteUrl = this.router.url;
      ga('set', 'page', this.router.url);
      ga('send', 'pageview');
    }
  }
}
