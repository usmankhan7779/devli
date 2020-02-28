import {
  Component, ElementRef, HostListener, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID, Renderer2,
  ViewChild
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalComponent } from '../account/modals/login-modal/login-modal.component';
import { SignupModalComponent } from '../account/modals/signup-modal/signup-modal.component';
import { ForgotPasswordModalComponent } from '../account/modals/forgot-password-modal/forgot-password-modal.component';
import { VerificationModalComponent } from '../account/modals/verification-modal/verification-modal.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription , Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NavbarService } from './navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private isAuthModalOpened = false;
  private showLoginPopupSubscription: Subscription;
  private showSignUpPopupSubscription: Subscription;
  private modalService;
  haveLiveGame = false;
  @ViewChild('mlbDDElement', {static: false}) mlbDDElement: ElementRef;
  @ViewChild('nflDDElement', {static: false}) nflDDElement: ElementRef;
  @ViewChild('nbaDDElement', {static: false}) nbaDDElement: ElementRef;
  @ViewChild('cfbDDElement', {static: false}) cfbDDElement: ElementRef;
  @ViewChild('bettingDDElement', {static: false}) bettingDDElement: ElementRef;
  @ViewChild('blogDDElement', {static: false}) blogDDElement: ElementRef;
  @ViewChild('podcastsDDElement', {static: false}) podcastsDDElement: ElementRef;
  @ViewChild('fanduelDDElement', {static: false}) fanduelDDElement: ElementRef;
  @ViewChild('draftkingsDDElement', {static: false}) draftkingsDDElement: ElementRef;
  mlbDropdownItemsLeft: any[];
  mlbDropdownItemsRight: any[];
  nflDropdownItemsLeft: any[];
  nflDropdownItemsRight: any[];
  nbaDropdownItemsLeft: any[];
  nbaDropdownItemsRight: any[];
  cfbDropdownItems: any[];
  bettingLinksLeft: any[];
  bettingLinksRight: any[];
  blogLinksLeft: any[];
  blogLinksRight: any[];
  fanduelLinksLeft: any[];
  fanduelLinksRight: any[];
  draftkingsLinksLeft: any[];
  draftkingsLinksRight: any[];
  podcastsLinksLeft: any[];
  podcastsLinksRight: any[];
  isNavbarCollapsed: boolean;
  windowWidth: number;

  private readonly openDDClassName = 'dd-opened';

  @HostListener('window:resize', ['$event']) onResize(event) {
    this.windowWidth = event.target.innerWidth;
    if (this.windowWidth > 991) {
      this.closeAllDDs();
    }
  }
  constructor(
    public _authService: AuthService,
    private router: Router,
    private navbarService: NavbarService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService = this.injector.get(NgbModal);
    }
    this.windowWidth = this.getWindowWidth();

    this.nbaDropdownItemsLeft = [
      {link: '/nba/lineups', title: 'NBA Starting Lineups'},
      {link: '/nba/rosters', title: 'NBA Rosters'},
      {link: '/nba/depth-charts', title: 'NBA Depth Charts'},
      {link: '/nba/matchups', title: 'NBA Matchups'},
      {link: '/nba/teams', title: 'NBA Teams'},
      {link: '/nba/standings', title: 'NBA Standings'},
      {link: '/nba/schedule', title: 'NBA Schedule'},
      {link: '/nba/players', title: 'NBA Players'}
    ];
    this.nbaDropdownItemsRight = [
      {link: '/nba/player-stats', title: 'NBA Player Stats'},
      {link: '/nba/player-ratings', title: 'NBA Player Ratings'},
      {link: '/nba/team-stats', title: 'NBA Team Stats'},
      {link: '/nba/team-rankings', title: 'NBA Team Rankings'},
      {link: '/nba/nba-fantasy-basketball-projections', title: 'NBA Fantasy Projections'},
      {link: '/nba/nba-player-minutes-per-game', title: 'NBA Projected Minutes'},
      {link: '/vegas-odds/nba-live-vegas-odds', title: 'NBA Vegas Odds'},
    ];

    this.mlbDropdownItemsLeft = [
      {link: '/mlb/lineups', title: 'MLB Starting Lineups'},
      {link: '/mlb/rosters', title: 'MLB Rosters'},
      {link: '/mlb/depth-charts', title: 'MLB Depth Charts'},
      {link: '/mlb/matchups', title: 'MLB Matchups'},
      {link: '/mlb/teams', title: 'MLB Teams'},
      {link: '/mlb/standings', title: 'MLB Standings'},
      {link: '/mlb/schedule', title: 'MLB Schedule'}
    ];

    this.mlbDropdownItemsRight = [
     {link: '/mlb/players', title: 'MLB Players'},
     {link: '/mlb/player-stats', title: 'MLB Player Stats'},
     {link: '/mlb/player-ratings', title: 'MLB Player Ratings'},
     {link: '/mlb/fantasy/baseball-projections', title: 'MLB Fantasy Projections'},
     {link: '/mlb/park-factors', title: 'MLB Park Factors'},
     {link: '/mlb/betting-system', title: 'MLB Bet Predictor'},
     {link: '/vegas-odds/mlb-live-vegas-odds', title: 'MLB Vegas Odds'},
    ];

    this.nflDropdownItemsRight = [
      {link: '/nfl/snap-counts', title: 'NFL Snap Counts'},
      {link: '/nfl/player-stats', title: 'NFL Player Stats'},
      {link: '/nfl/player-ratings', title: 'NFL Player Ratings'},
      {link: '/nfl/team-stats', title: 'NFL Team Stats'},
      {link: '/nfl-team-rankings', title: 'NFL Team Rankings'},
      {link: '/vegas-odds/nfl-live-vegas-odds', title: 'NFL Vegas Odds'},
      {link: '/fantasy-football-rankings', title: 'Fantasy Football Rankings'}
    ];


    this.nflDropdownItemsLeft = [
      {link: '/nfl/rosters', title: 'NFL Rosters'},
      {link: '/nfl/depth-charts', title: 'NFL Depth Charts'},
      {link: '/nfl/matchups', title: 'NFL Matchups'},
      {link: '/nfl/players', title: 'NFL Players'},
      {link: '/nfl/schedule', title: 'NFL Schedule'},
      {link: '/nfl/teams', title: 'NFL Teams'},
      {link: '/nfl/standings', title: 'NFL Standings'},
      {link: '/nfl/nfl-targets', title: 'NFL Targets'}
    ];

    this.cfbDropdownItems = [
      {link: '/college-football/teams', title: 'Teams'},
      {link: '/college-football/players', title: 'Players'},
      {link: '/college-football/rosters', title: 'Rosters'},
    ];

    this.bettingLinksLeft = [
      {link: 'https://www.lineups.com/betting/sports/', title: 'US Sports Betting'},
      {link: 'https://www.lineups.com/betting/sports-betting-legal-in-united-states/', title: 'Is Sports Betting Legal?'},
      {link: 'https://www.lineups.com/betting/new-jersey/', title: 'New Jersey Sports Betting'},
      {link: 'https://www.lineups.com/betting/nfl-picks/', title: 'Free NFL Betting Picks'},
      {link: 'https://www.lineups.com/betting/promo-codes/monkey-knife-fight/', title: 'Monkey Knife Fight Promo'},
      {link: 'https://www.lineups.com/betting/pointsbet-promo-code/', title: 'PointsBet Promo Code'},
      {link: 'https://www.lineups.com/betting/888-sportsbook-promo-code/', title: '888 Sports Promo Code'},
      {link: 'https://www.lineups.com/betting/michigan-lottery-promo-code/', title: 'MI Lottery Promo Code'},
    ];

    this.bettingLinksRight = [
      {link: 'https://www.lineups.com/betting/news/', title: 'Betting News'},
      {link: 'https://www.lineups.com/betting/pennsylvania/', title: 'Pennsylvania Sports Betting'},
      {link: 'https://www.lineups.com/betting/sports-betting-indiana-legal-timeline/', title: 'Indiana Sports Betting'},
      {link: 'https://www.lineups.com/betting/sportsbook-reviews/', title: 'Online Sportsbook Reviews'},
      {link: 'https://www.lineups.com/betting/william-hill-sportsbook-promo-code/', title: 'William Hill Promo Code'},
      {link: 'https://www.lineups.com/betting/sugarhouse-sportsbook-promo-code/', title: 'Sugarhouse Promo Code'},
      {link: 'https://www.lineups.com/betting/fox-bet-sportsbook-promo-code/', title: 'FoxBet Promo Code'},
      {link: 'https://www.lineups.com/betting/promo-codes/pa-lottery-bonus-code/', title: 'PA Lottery Bonus Code'}
    ];

    this.blogLinksLeft = [
      {link: 'https://www.lineups.com/articles/nba/', title: 'NBA Articles'},
      {link: 'https://www.lineups.com/articles/nfl/', title: 'NFL Articles'},
      {link: 'https://www.lineups.com/articles/fantasy-football/', title: 'Fantasy Football 2020'},
      {link: 'https://www.lineups.com/articles/fantasy-basketball/', title: 'Fantasy Basketball 2020'}
    ];

    this.blogLinksRight = [
      {link: 'https://www.lineups.com/articles/mlb/', title: 'MLB Articles'},
      {link: 'https://www.lineups.com/articles/authors/', title: 'Authors'},
      {internalLink: '/sports-scholarship', title: 'Scholarship'}
    ];

    this.podcastsLinksLeft = [
      {link: 'https://www.lineups.com/podcasts/nba/', title: 'NBA'},
      {link: 'https://www.lineups.com/podcasts/nfl-talking-heads-fantasy-football-podcast/', title: 'Fantasy Football'},
      {link: 'https://www.lineups.com/podcasts/join-lineups-podcast-network/', title: 'Join Network'}
    ];

    this.podcastsLinksRight = [
      {link: 'https://www.lineups.com/podcasts/sharp-edges-sports-betting/', title: 'Sports Betting'},
      {link: 'https://www.lineups.com/podcasts/hosts/', title: 'Hosts'}
    ];

    this.fanduelLinksLeft = [
      {link: 'https://www.lineups.com/betting/fanduel-sportsbook-review/', title: 'FanDuel Sportsbook Review'},
      {link: 'https://www.lineups.com/betting/odds/fanduel-sportsbook/', title: 'FanDuel Sportsbook Live Odds'},
      {link: 'https://www.lineups.com/betting/fanduel-daily-fantasy-picks/', title: 'FanDuel Daily Fantasy Picks'},
    ];

    this.fanduelLinksRight = [

    ];

    this.draftkingsLinksLeft = [
      {link: 'https://www.lineups.com/betting/reviews/draftkings-sportsbook/', title: 'DraftKings Sportsbook Review'},
      {link: 'https://www.lineups.com/betting/odds/draftkings-sportsbook/', title: 'DraftKings Sportsbook Live Odds'},
      {link: 'https://www.lineups.com/betting/draftkings-daily-fantasy-picks/', title: 'DraftKings Daily Fantasy Picks'},
    ];

    this.draftkingsLinksRight = [

    ];

    this.isNavbarCollapsed = true;

  }

  ngOnInit() {
    this.showLoginPopupSubscription = this._authService.showLoginPopupSubject
      .subscribe((options) => {
        if (!this.isAuthModalOpened && !this._authService.isLoggedIn()) {
          this.openLoginModal(null, options);
        }
      });
    this.showSignUpPopupSubscription = this._authService.showSignUpPopupSubject
      .subscribe((options) => {
        if (!this.isAuthModalOpened && !this._authService.isLoggedIn()) {
          this.openSignupModal(options);
        }
      });
    // this.navbarService.isLiveGamePresent()
    //   .catch(() => {
    //     this.haveLiveGame = false;
    //     return Observable.empty();
    //   })
    //   .subscribe(() => {
    //     this.haveLiveGame = true;
    //   });
  }

  ngOnDestroy() {
    this.showLoginPopupSubscription.unsubscribe();
    this.showSignUpPopupSubscription.unsubscribe();
  }

  logOut() {
    this._authService.logout();
  }

  openLoginModal(flashMessage = null, options?) {
    this.isAuthModalOpened = true;
    const modalRef = this.modalService.open(LoginModalComponent, {
      size: 'lg',
      keyboard: !(options && options.blockUserActivity),
      windowClass: `lineups-custom-modal modal-cozy login-modal ${options ? options.windowClass : ''}`,
      backdrop: options && options.blockUserActivity ? 'static' : true
    });
    modalRef.componentInstance.flashMessage = flashMessage;
    this.applyModalOptions(options, modalRef);
    modalRef.result.then(
      closeVal => {
        this.isAuthModalOpened = false;
      },
      dismissVal => {
        this.isAuthModalOpened = false;
        if (!dismissVal) {
          return;
        }
        if (dismissVal === 'signUp') {
          this.openSignupModal(options);
        } else if (dismissVal === 'verify-code') {
          this.openVerificationModal();
        } else if (dismissVal === 'password') {
          this.openPasswordModal(options);
        } else {
          return;
        }
        // Dismissed : When redirecting to Password-Reset
        // this.openPasswordModal();
      }
    );
  }

  openVerificationModal(extraVal = null, options?) {
    const modalRef = this.modalService.open(VerificationModalComponent, {
      size: 'lg',
      keyboard: !(options && options.blockUserActivity),
      windowClass: `lineups-custom-modal modal-cozy verification-modal ${options ? options.windowClass : ''}`,
      backdrop: (options && options.blockUserActivity ? 'static' : true)
    });
    this.applyModalOptions(options, modalRef);
    modalRef.componentInstance.email = extraVal || 'your email';
    modalRef.result.then(
      closeVal => {},
      dismissVal => {
        if (dismissVal === 0) {
          return;
        } else {
          this.openLoginModal(dismissVal, options);
        }
      }
    );
  }

  openPasswordModal(options?) {
  this.isAuthModalOpened = true;
    const modalRef = this.modalService.open(ForgotPasswordModalComponent, {
      size: 'lg',
      keyboard: !(options && options.blockUserActivity),
      windowClass: `lineups-custom-modal modal-cozy password-modal ${options ? options.windowClass : ''}`,
      backdrop: options && options.blockUserActivity ? 'static' : true
    });
    this.applyModalOptions(options, modalRef);
    modalRef.result.then(
      closeVal => {
        this.isAuthModalOpened = false;
      },
      dismissVal => {
        this.isAuthModalOpened = false;
        if (dismissVal) {
          this.openLoginModal(dismissVal, options);
        } else {
          return;
        }
      });
  }

  openSignupModal(options?) {
    this.isAuthModalOpened = true;
    const modalRef = this.modalService.open(SignupModalComponent, {
      size: 'lg',
      keyboard: !(options && options.blockUserActivity),
      windowClass: `lineups-custom-modal modal-cozy sign-up-modal ${options ? options.windowClass : ''}`,
      backdrop: options && options.blockUserActivity ? 'static' : true
    });
    this.applyModalOptions(options, modalRef);
    modalRef.result.then(
      closeVal => {
        this.isAuthModalOpened = false;
        console.log(closeVal);
      },
      dismissVal => {
        this.isAuthModalOpened = false;
        if (dismissVal === 'login') {
          this.openLoginModal(null, options);
        } else if (typeof dismissVal === 'string' && dismissVal !== 'login') {
          this.openVerificationModal(dismissVal, options);
        } else {
          return;
        }
      }
    );
  }

  onOpenDD(mode: string, ref, plus = false) {
    const originState = ref.classList.contains(this.openDDClassName);
    if (this.windowWidth < 992 && plus) {
      this.closeAllDDs();
      if (mode === 'nfl') {
        this.toggleDD(this.nflDDElement, originState);
      }
      if (mode === 'mlb') {
        this.toggleDD(this.mlbDDElement, originState);
      }
      if (mode === 'nba') {
        this.toggleDD(this.nbaDDElement, originState);
      }
      if (mode === 'college-football') {
        this.toggleDD(this.cfbDDElement, originState);
      }
      if (mode === 'betting') {
        this.toggleDD(this.bettingDDElement, originState);
      }
      if (mode === 'articles') {
        this.toggleDD(this.blogDDElement, originState);
      }
      if (mode === 'fanduel') {
        this.toggleDD(this.fanduelDDElement, originState);
      }
      if (mode === 'draftkings') {
        this.toggleDD(this.draftkingsDDElement, originState);
      }
      if (mode === 'podcasts') {
        this.toggleDD(this.podcastsDDElement, originState);
      }
    } else if (mode !== 'betting' && mode !== 'articles' && mode !== 'podcasts' && mode !== 'draftkings' && mode !== 'fanduel') {
      this.router.navigate([`/${mode}`]);
    }
    if (!plus) {
      this.onNavbarClose();
    }
  }

  onNavbarClose() {
    this.isNavbarCollapsed = true;
    this.closeAllDDs();
  }

  private getWindowWidth() {
    if (typeof window !== 'undefined') {
      return this.windowWidth = window.innerWidth;
    }
    return 0;
  }

  private applyModalOptions(options, modalRef) {
    if (options) {
      for (const key in options) {
        if (key !== 'windowClass' &&
          options.hasOwnProperty(key) &&
          modalRef && modalRef.componentInstance &&
          modalRef.componentInstance.hasOwnProperty(key)) {

            modalRef.componentInstance[key] = options[key];

        }
      }
    }
  }

  isActiveNav(url) {
    return this.router.url.indexOf('/' + url) !== -1;
  }

  private toggleDD(element, originState) {
    if (originState) {
      this.closeDD(element);
    } else {
      this.showDD(element);
    }
  }

  private showDD(element) {
    if (element.nativeElement.classList.contains(this.openDDClassName)) {
      return;
    }
    this.renderer.addClass(element.nativeElement, this.openDDClassName);
    this.renderer.addClass(element.nativeElement.parentElement, this.openDDClassName);
  }
  private closeDD(element) {
    if (element.nativeElement.classList.contains(this.openDDClassName)) {
      this.renderer.removeClass(element.nativeElement, this.openDDClassName);
      this.renderer.removeClass(element.nativeElement.parentElement, this.openDDClassName);
    }
  }

  private closeAllDDs() {
    this.closeDD(this.nflDDElement);
    this.closeDD(this.mlbDDElement);
    this.closeDD(this.bettingDDElement);
    this.closeDD(this.nbaDDElement);
    // this.closeDD(this.cfbDDElement);
    this.closeDD(this.blogDDElement);
    this.closeDD(this.draftkingsDDElement);
    this.closeDD(this.fanduelDDElement);
    this.closeDD(this.podcastsDDElement);
  }
}
