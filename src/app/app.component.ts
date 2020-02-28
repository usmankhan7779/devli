
import {mergeMap, map, filter} from 'rxjs/operators';



import { environment } from 'environments/environment';
import {
  Component, HostListener, Inject, Injector, NgModuleFactoryLoader, OnInit, PLATFORM_ID, Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { GoogleAnalyticsEventsService } from './google-analytics-events.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonService } from './shared/services/common.service';
import { ServerResponseService } from './shared/services/server-response.service';
import { LinkService } from './shared/services/link.service';
import { TitleService } from './shared/services/title.service';
import { SchemaService } from './shared/services/schema.service';
import { ServiceWorkerService } from './shared/services/service-worker.service';
import { NavbarService } from './navbar/navbar.service';
import { ScoreBarHelperService } from './score-bar/score-bar-helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdModalComponent } from './shared/modals/ad-modal/ad-modal.component';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { GeolocationService } from './shared/services/geolocation.service';

declare let ga: Function;

const botUserAgents = [
  'googlebot',
  'google-structured-data-testing-tool',
  'bingbot',
  'linkedinbot',
  'mediapartners-google',
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./inline-style/inline-style.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  openedInIframe: boolean;
  isAndroid: boolean;
  showNavbar = true;
  sumedges = null;
  @ViewChild('scorebarContainer', {read: ViewContainerRef, static: true}) viewContainer: ViewContainerRef;
  private modalService;
  scoreBarReadySubscription: Subscription;

  // @HostListener('window:resize', ['$event']) onResize(event) {
  //   const width = event.target.innerWidth;
  //   if (this.isAndroid && width < 769) {
  //     const height = event.target.innerHeight;
  //     const sumedges = width + height;
  //     if (this.sumedges && sumedges < this.sumedges) {
  //       this.videoDataService.showMainVideo(false);
  //     } else {
  //       this.videoDataService.showMainVideo(true);
  //     }
  //   }
  // }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scoreBarService: ScoreBarHelperService,
    private titleService: TitleService,
    private commonService: CommonService,
    private renderer: Renderer2,
    private serverResponseService: ServerResponseService,
    private metaService: Meta,
    private linkService: LinkService,
    private schemaService: SchemaService,
    private navbarService: NavbarService,
    private authService: AuthService,
    // private videoDataService: VideoDataService,
    private serviceWorkerService: ServiceWorkerService,
    private geolocationService: GeolocationService,
    @Inject(DOCUMENT) private document,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly loader: NgModuleFactoryLoader,
    private readonly injector: Injector
  ) {
    if (isPlatformBrowser(this.platformId) && window) {
      this.modalService = this.injector.get(NgbModal);
      this.sumedges = window.innerWidth + window.innerHeight;
      this.isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
      if (this.isNotMobile()) {
        this.addTwitterScript();
        // if (this.checkBots()) {
        //   this.addVideoPlayerContainer();
        // }
      } else {
        this.renderer.addClass(this.document.body, 'mobile-body');
      }
    }
    this.trackTabsCount();
  }

  ngOnInit() {

    this.openedInIframe = this.commonService.openedInIframe();
    if (isPlatformBrowser(this.platformId) && !this.openedInIframe) {
      if (this.isNotMobile()) {
        this.loadScorebar();
        // this.videoDataService.addScript.subscribe(() => {
        //   if (this.checkBots()) {
        //     this.videoDataService.addVideoScriptMethod(this.videoDataService.getCurrentPageVideoData());
        //   }
        // });
      }
    }
    if (this.openedInIframe) {
      this.renderer.setStyle(this.document.body, 'padding-top', '10px');
      this.renderer.setStyle(this.document.body, 'margin-bottom', '0');
    }
    this.navbarService.navbarViewUpdated
      .subscribe((val) => {
        this.showNavbar = val;
      });

    this.router.events.pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.schemaService.firstBrowserLoad = false;
        this.schemaService.removeSchema();
        this.schemaService.removeSchema(true);
      });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => {
        if (event instanceof NavigationEnd) {
          // redirect to https://www.lineups.com/blog/
          if (event.url === '/blog' || event.url === '/articles' ||
            event.url === '/blog/uncategorized' || event.url === '/articles/uncategorized') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/articles/');
            return event;
          }
          if (event.url === '/betting') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/betting/');
            return event;
          }
          if (event.url === '/draftkings-sportsbook-promo-code' || event.url === '/draftkings-sportsbook-promo-codes') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/draftkings-sportsbook-promo-code/');
            return event;
          }
          if (event.url === '/pennsylvania') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/betting/pennsylvania/');
            return event;
          }
          if (event.url === '/go/sugarhouse') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/betting/sugarhouse-sportsbook-promo-code/');
            return event;
          }
          if (event.url === '/pointsbet-promo-code') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/betting/pointsbet-promo-code/');
            return event;
          }
          if (event.url === '/fanduel-sportsbook-promo') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/fanduel-sportsbook-promo/');
            return event;
          }
          if (event.url === '/podcasts') {
            this.serverResponseService.serverRedirect('https://www.lineups.com/podcasts/');
            return event;
          }

          if (event.urlAfterRedirects !== '/404' && event.url !== event.urlAfterRedirects) {
            this.serverResponseService.serverRedirect(event.urlAfterRedirects);
          }
        }
        return event;
      }),
      map(() => this.activatedRoute),
      map((route) => {
        // if (isPlatformBrowser(this.platformId) && !this.openedInIframe) {
        //   const isPlayerDefferedPage = this.checkPageWithDefferedPlayerStart(this.commonService.getCurrentUrl());
        //   if (!isPlayerDefferedPage && this.checkBots() && this.isNotMobile()) {
        //     this.videoDataService.addVideoScript();
        //   }
        // }
        this.addCanonical();
        this.scrollToZero();
        while (route.firstChild) {
          route = route.firstChild;
        }
        this.updateSBLeague();
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data))
      .subscribe((data) => {
        if (data['title'] && data['title'] !== 'DYNAMIC') {
          this.titleService.setTitle(data['title']);
        }
      });
  }

  private checkPageWithDefferedPlayerStart(currentUrl) {
    return currentUrl.indexOf('/mlb/player-stats/') !== -1 ||
      currentUrl.indexOf('/nba/player-stats/') !== -1 ||
      currentUrl.indexOf('/nfl/player-stats/') !== -1;
  }

  private updateSBLeague() {
    if (this.scoreBarService.scoreBarReady) {
      this.scoreBarService.updateSorebarLeague();
    } else if (!this.scoreBarReadySubscription) {
      this.scoreBarReadySubscription = this.scoreBarService.scoreBarReadyEvent.subscribe(() => {
        this.scoreBarService.updateSorebarLeague();
      });
    }
  }

  private loadScorebar() {
    this.loader.load('src/app/score-bar/score-bar.module#ScoreBarModule')
      .then(factory => {
        const module = factory.create(this.injector);
        const entryComponentType = module.injector.get('LAZY_SCORE_BAR');
        const componentFactory = module.componentFactoryResolver.resolveComponentFactory(entryComponentType);
        this.viewContainer.createComponent(componentFactory);
      });
  }

  private addCanonical() {
    const location = `https://www.lineups.com${this.commonService.getCurrentUrl()}`;
    this.linkService.removeTag('rel="canonical"');
    this.linkService.addTag({ rel: 'canonical', href: location });
  }

  private scrollToZero() {
    this.commonService.scrollTopPage();
  }

  private showAdModal() {
    if (isPlatformBrowser(this.platformId) && this.checkSingleWindow()) {
      setTimeout(() => {
        this.modalService.open(AdModalComponent, {
          windowClass: `lineups-custom-modal common-modal animation-modal ad-pennsylvania-modal`
        });
      }, 5000);
    }
  }

  private checkSingleWindow() {
    if (this.authService.hasStorage) {
      return +(localStorage.getItem('tabCount') || 0) === 1;
    }
    return true;
  }

  private trackTabsCount() {
    if (isPlatformBrowser(this.platformId) && this.authService.hasStorage) {
      let newCount = +(localStorage.getItem('tabCount') || 0) + 1;
      if (newCount <= 0) {
        newCount = 1;
      }
      localStorage.setItem('tabCount', newCount.toString());
      window.addEventListener('beforeunload', function () {
        localStorage.setItem('tabCount', (+localStorage.getItem('tabCount') - 1).toString());
      });
    }
  }

  private addVideoPlayerContainer() {
    const container = this.renderer.createElement('div');
    this.renderer.setAttribute(container, 'class', 'main-video body-main-video');
    this.renderer.setAttribute(container, 'style', 'display: none');
    const closeContainer = this.renderer.createElement('div');
    this.renderer.setAttribute(closeContainer, 'class', 'close-main-video');
    const i = this.renderer.createElement('i');
    this.renderer.setAttribute(i, 'class', 'fa fa-times');
    this.renderer.setAttribute(i, 'aria-hidden', 'true');
    this.renderer.appendChild(closeContainer, i);
    this.renderer.appendChild(container, closeContainer);
    this.renderer.appendChild(this.document.body, container);
    closeContainer.addEventListener('click', function () {
      this.parentElement.style.display = 'none';
      // tslint:disable-next-line:max-line-length
      this.parentElement.removeChild(this.parentElement.querySelector('.s2nFriendlyFrame') || this.parentElement.querySelector('.s2nPlayer'));
      const script = (<any>document).querySelector('script[data-type="s2nScript"]');
      script.parentElement.removeChild(script);
    });
  }

  private addTwitterScript() {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    const s = this.document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  }

  private checkBots() {
    let res = false;
    if (isPlatformBrowser(this.platformId) && !this.openedInIframe) {
      try {
        res = !(new RegExp(botUserAgents.join('|')).test((<any>window).navigator.userAgent.toLowerCase()));
      } catch (e) {
        res = false;
      }
    }
    return res;
  }

  private isNotMobile() {
    return isPlatformBrowser(this.platformId) && window && window.innerWidth > 767;
  }
}
