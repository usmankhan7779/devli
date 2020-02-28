import { environment } from 'environments/environment';
import {
  ModuleWithProviders, NgModule, ErrorHandler, Injectable, NgModuleFactoryLoader,
  SystemJsNgModuleLoader, PLATFORM_ID, Inject
} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { DeprecatedI18NPipesModule, isPlatformServer } from '@angular/common'
import { NoPreloading, RouterModule, Routes, UrlSerializer } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

import { LoginModalComponent } from './account/modals/login-modal/login-modal.component';
import { ForgotPasswordModalComponent } from './account/modals/forgot-password-modal/forgot-password-modal.component';
import { SignupModalComponent } from './account/modals/signup-modal/signup-modal.component';
import { VerificationModalComponent } from './account/modals/verification-modal/verification-modal.component';

// Services

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { GoogleAnalyticsEventsService } from './google-analytics-events.service';
import { LastTeamNamePipe } from './shared/pipes/last-team-name.pipe';

import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';
import { AuthRequestInterceptor } from './shared/services/http.interceptor.service';
import { AuthApiService } from './auth/auth-api.service';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerResponseService } from './shared/services/server-response.service';
import { LinkService } from './shared/services/link.service';
import { NavbarService } from './navbar/navbar.service';
import { BreadcrumbService } from './shared/components/breadcrumb/breadcrumb.service';
import { OrderBy } from './shared/pipes/order-by.pipe';
import { TitleService } from './shared/services/title.service';
import { LogoPipe } from './shared/pipes/logo.pipe';
import CustomUrlSerializer from './shared/services/custom-url-serializer.service';
import { SchemaService } from './shared/services/schema.service';
import { ServiceWorkerService } from './shared/services/service-worker.service';
import * as Sentry from '@sentry/browser';
import { CommonService } from './shared/services/common.service';
import { ExternalRedirectResolver } from './shared/components/external-redirect/external-redirect.resolver';
import { EmptyComponent } from './shared/components/external-redirect/empty.component';



if (environment.production) {
  Sentry.init({
    dsn: environment.sentryUrl,
    blacklistUrls: [new RegExp(/iflychat/), new RegExp(/twitter/), new RegExp(/embedcode/)],
    ignoreErrors: [new RegExp(/Network Error/)]
  });
}


const customUrlSerializer = new CustomUrlSerializer();
const CustomUrlSerializerProvider = {
  provide: UrlSerializer,
  useValue: customUrlSerializer
};


const appRoutes: Routes = [
  // Redirects START
  {
    path: 'go/mkf-50',
    redirectTo: 'mlb/go/mkf-50'
  },
  {
    path: 'mlb/go/mkf-50',
    component: EmptyComponent,
    resolve: {
      data: ExternalRedirectResolver
    },
    data: {
      externalUrl: 'https://www.monkeyknifefight.com/featured/mlb?p_source=affiliate&p_affiliate=lineups'
    }
  },
  {
    path: 'nba/go/mkf-50',
    component: EmptyComponent,
    resolve: {
      data: ExternalRedirectResolver
    },
    data: {
      externalUrl: 'https://www.monkeyknifefight.com/featured/nba?p_source=affiliate&p_affiliate=lineups'
    }
  },
  {
    path: 'go/fd-sb',
    component: EmptyComponent,
    resolve: {
      data: ExternalRedirectResolver
    },
    data: {
      externalUrl: 'http://wlfanduel.adsrv.eacdn.com/C.ashx?btag=a_14975b_1977c_&affid=10412&siteid=14975&adid=1977&c='
    }
  },
  // nfl matchups bad routes START
  {
    path: 'assets/images/nfl/logos/leagues/national.png',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: '2018/:date/:name',
    pathMatch: 'full',
    redirectTo: 'nfl/matchups'
  },
  {
    path: '2017/:date/:name',
    pathMatch: 'full',
    redirectTo: 'nfl/matchups'
  },
  // nfl matchups bad routes END
  {
    path: 'teams',
    pathMatch: 'full',
    redirectTo: 'nfl/teams'
  },
  {
    path: 'lineups',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'nfl/teams/stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats'
  },
  {
    path: 'nfl/teams/stats/offense-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/offense'
  },
  {
    path: 'nfl/teams/stats/defense-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/defense'
  },
  {
    path: 'nfl/teams/stats/special-teams-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/special-teams'
  },
  {
    path: 'nfl/teams/stats/offensive-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/offense'
  },
  {
    path: 'nfl/teams/stats/2018',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats'
  },
  {
    path: 'nfl/teams/stats/defensive-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/defense'
  },
  {
    path: 'nfl/team/stats/offense-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/offense'
  },
  {
    path: 'nfl/team/stats/defense-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/defense'
  },
  {
    path: 'nfl/team/stats/special-teams-stats',
    pathMatch: 'full',
    redirectTo: 'nfl/team-stats/special-teams'
  },
  {
    path: 'nfl-snap-counts',
    pathMatch: 'full',
    redirectTo: 'nfl/snap-counts'
  },
  {
    path: 'nfl-targets-touches',
    pathMatch: 'full',
    redirectTo: 'nfl/nfl-targets'
  },
  {
    path: 'nba/schedule/2017/chicago-white-sox',
    pathMatch: 'full',
    redirectTo: 'mlb/schedule/chicago-white-sox'
  },
  {
    path: 'cfb/players',
    pathMatch: 'full',
    redirectTo: 'college-football/players'
  },
  // Redirects End
  {
    path: 'draftkings-sportsbook-promo-code',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'draftkings-sportsbook-promo-codes',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'pointsbet-promo-code',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'go/sugarhouse',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'fanduel-sportsbook-promo',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'pennsylvania',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'nba/player-ratings',
    data: {
      league: 'nba',
    },
    loadChildren: () => import('./player-ratings/player-ratings.module')
      .then(m => m.PlayerRatingsModule)
  },
  {
    path: 'nfl/player-ratings',
    data: {
      league: 'nfl',
    },
    loadChildren: () => import('./player-ratings/player-ratings.module')
      .then(m => m.PlayerRatingsModule)
  },
  {
    path: 'mlb/player-ratings',
    data: {
      league: 'mlb',
    },
    loadChildren: () => import('./player-ratings/player-ratings.module')
      .then(m => m.PlayerRatingsModule)
  },
  {
    path: 'sports-scholarship',
    loadChildren: () => import('./scholarship-program/scholarship-program.module')
      .then(m => m.ScholarshipProgramModule)
  },
  {
    path: 'pricing',
    loadChildren: () => import('./static/pricing/pricing.module')
      .then(m => m.PricingModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./static/terms-use/terms-use.module')
      .then(m => m.TermsUseModule)
  },
  {
    path: 'license',
    loadChildren: () => import('./static/license/license.module')
      .then(m => m.LicenseModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./static/faq/faq.module')
      .then(m => m.FaqModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./static/about/about.module')
      .then(m => m.AboutModule)
  },
  {
    path: 'betting-daily-fantasy-tools-affiliate-program',
    loadChildren: () => import('./static/affiliate/affiliate.module')
      .then(m => m.AffiliateModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./static/privacy/privacy.module')
      .then(m => m.PrivacyModule)
  },
  {
    path: 'billing-terms',
    loadChildren: () => import('./static/billing-terms/billing-terms.module')
      .then(m => m.BillingTermsModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./static/contact/contact.module')
      .then(m => m.ContactModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./static/friends/friends.module')
      .then(m => m.FriendsModule)
  },
  {
    path: 'prediction-models-explained',
    loadChildren: () => import('./static/prediction-models-explained/prediction-models-explained.module')
      .then(m => m.PredictionModelsExplainedModule)
  },
  {
    path: 'betting-tools-glossary',
    loadChildren: () => import('./static/betting-tools-glossary/betting-tools-glossary.module')
      .then(m => m.BettingToolsGlossaryModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module')
      .then(m => m.AccountModule)
  },
  {
    path: 'nhl',
    loadChildren: () => import('./nhl/nhl.module')
      .then(m => m.NhlModule)
  },
  {
    path: 'nfl/simulator',
    loadChildren: () => import('./nfl/simulator/simulator.module')
      .then(m => m.SimulatorModule)
  },
  {
    path: 'nfl/watch-simulation',
    loadChildren: () => import('./nfl/animation/animation.module')
      .then(m => m.AnimationModule)
  },
  {
    path: 'nfl',
    loadChildren: () => import('./nfl/nfl.module')
      .then(m => m.NflModule)
  },
  {
    path: 'mlb/park-factors',
    loadChildren: () => import('./mlb/park-factor-tools/park-factor-tools.module')
      .then(m => m.ParkFactorToolsModule)
  },
  {
    path: 'mlb/depth-charts',
    loadChildren: () => import('./mlb/depth-charts/depth-charts.module')
      .then(m => m.DepthChartsModule)
  },
  {
    path: 'mlb',
    loadChildren: () => import('./mlb/mlb.module')
      .then(m => m.MlbModule)
  },
  {
    path: 'mlb/mlb-fantasy-baseball-projections',
    pathMatch: 'full',
    redirectTo: 'mlb/fantasy/baseball-projections'
  },
  {
    path: 'mlb/fantasy/baseball-projections',
    loadChildren: () => import('./mlb/fantasy-baseball-projections/fantasy-baseball-projections.module')
      .then(m => m.FantasyBaseballProjectionsModule)
  },
  {
    path: 'nba/player-stats',
    loadChildren: () => import('./nba/stats/single-player/nba-single-player.module')
      .then(m => m.NbaSinglePlayerModule)
  },
  {
    path: 'nba/team-stats',
    loadChildren: () => import('./nba/team-stats/team-stats.module')
      .then(m => m.TeamStatsModule)
  },
  {
    path: 'nba/team-rankings',
    loadChildren: () => import('./nba/team-stats/team-rankings/team-rankings.module')
      .then(m => m.TeamRankingsModule)
  },
  {
    path: 'nba/lineups',
    loadChildren: () => import('./nba/lineups-gateway/lineups-gateway.module')
      .then(m => m.LineupsGatewayModule)
  },
  {
    path: 'nba/nba-player-minutes-per-game',
    loadChildren: () => import('./nba/minutes/nba-player-minutes-per-game.module')
      .then(m => m.NbaPlayerMinutesPerGameModule)
  },
  {
    path: 'nba/nba-fantasy-basketball-projections',
    loadChildren: () => import('./nba/minutes/fantasy-projections/fantasy-projections.module')
      .then(m => m.FantasyProjectionsModule)
  },
  {
    path: 'nba/fantasy-points-per-game',
    loadChildren: () => import('./nba/minutes/nba-fantasy-basketball-projections.module')
      .then(m => m.NbaFantasyBasketballProjectionsModule)
  },
  // nfl/fantasy/football-projections Redirect START
  {
    path: 'nfl/fantasy/football-projections',
    pathMatch: 'full',
    redirectTo: 'fantasy-football-projections'
  },
  {
    path: 'nfl/fantasy/football-rankings',
    pathMatch: 'full',
    redirectTo: 'fantasy-football-rankings'
  },
  {
    path: 'nfl/fantasy/football-rankings/quaterback-qb-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/quarterback-qb'
  },
  {
    path: 'nfl/fantasy/football-rankings/quarterback-qb-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/quarterback-qb'
  },
  {
    path: 'nfl/fantasy/football-rankings/running-back-rb-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/running-back-rb'
  },
  {
    path: 'nfl/fantasy/football-rankings/tight-end-te-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/tight-end-te'
  },
  {
    path: 'nfl/fantasy/football-rankings/wide-receiver-wr-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/wide-receiver-wr'
  },
  {
    path: 'nfl/fantasy/football-rankings/kicker-k-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/kicker-k'
  },
  {
    path: 'nfl/fantasy/football-rankings/dst-team-defense-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/team-defense-dst'
  },
  {
    path: 'nfl/fantasy/football-rankings/idp-defensive-player-fantasy-rankings',
    redirectTo: 'fantasy-football-rankings/defensive-player-idp'
  },
  // nfl/fantasy/football-projections Redirect END
  // /nfl/teams/team-rankings Redirect Start
  {
    path: 'nfl/teams/team-rankings',
    redirectTo: 'nfl-team-rankings'
  },
  {
    path: 'nfl/teams/team-rankings/special-teams',
    redirectTo: 'nfl-team-rankings/special-teams'
  },
  {
    path: 'nfl/teams/team-rankings/defense',
    redirectTo: 'nfl-team-rankings/defense'
  },
  // /nfl/teams/team-rankings Redirect END
  {
    path: 'nfl-team-rankings',
    loadChildren: () => import('./nfl/teams/team-rankings/nfl-team-rankings.module')
      .then(m => m.NflTeamRankingsModule)
  },
  {
    path: 'fantasy-football-rankings',
    loadChildren: () => import('./nfl/fantasy-football-player-rankings/fantasy-football-rankings.module')
      .then(m => m.FantasyFootballRankingsModule)
  },
  {
    path: 'fantasy-football-projections',
    loadChildren: () => import('./nfl/fantasy-football-projections/fantasy-football-projections.module')
      .then(m => m.FantasyFootballProjectionsModule)
  },
  {
    path: 'nfl-daily-fantasy-dfs-projections',
    loadChildren: () => import('./nfl/nfl-daily-fantasy-dfs-projections/nfl-daily-fantasy-dfs-projections.module')
      .then(m => m.NflDailyFantasyDfsProjectionsModule)
  },
  {
    path: 'nba',
    loadChildren: () => import('./nba/nba.module')
      .then(m => m.NbaModule)
  },
  {
    path: 'college-football',
    loadChildren: () => import('./college-football/college-football.module')
      .then(m => m.CollegeFootballModule)
  },
  {
    path: 'vegas-odds',
    loadChildren: () => import('./vegas-odds/vegas-odds.module')
      .then(m => m.VegasOddsModule)
  },
  {
    path: 'undefined',
    pathMatch: 'full',
    redirectTo: ''
  },
  // first redirect to '', to prevent 404 and then 301 to to https://www.lineups.com/blog/
  {
    path: 'blog',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'articles',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'betting',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'podcasts',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'blog/uncategorized',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: 'articles/uncategorized',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: '404',
    component: NotFoundComponent,
    data: {
      title: '404 - Page Not Found'
    }
  },
  { path: 'lineup_route_test', redirectTo: '' },
  { path: '**', redirectTo: '404' }
];

// App Routing
export const rootRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes, {
  useHash: false,
  preloadingStrategy: NoPreloading,
  initialNavigation: 'enabled' // helps with "flicker" you can get from styles in Universal
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  handleError(error) {
    if (environment.production) {
      const errorToSend = error.originalError || error;
      Sentry.captureException(errorToSend);
      console.error('global error handler: ', error);
      if (isPlatformServer(this.platformId)) {
        return console.error('error caught by server', error);
      }
    }
    throw error;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginModalComponent,
    ForgotPasswordModalComponent,
    SignupModalComponent,
    VerificationModalComponent,
    EmptyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    // Our Http TransferData method (use TransferHttp instead of regular http.GET()
    // if you want the data to be transfered via the window{} and re-used on the client-side.
    TransferHttpModule,
    HomeModule,
    SharedModule,
    DeprecatedI18NPipesModule,
    rootRouting
  ],
  providers: [
    Title,
    LastTeamNamePipe,
    LogoPipe,
    AuthService,
    AuthApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRequestInterceptor,
      multi: true,
    },
    {provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader},
    TitleService,
    BreadcrumbService,
    NavbarService,
    AuthGuard,
    GoogleAnalyticsEventsService,
    ServerResponseService,
    LinkService,
    OrderBy,
    CustomUrlSerializerProvider,
    SchemaService,
    CommonService,
    ServiceWorkerService,
    ExternalRedirectResolver,
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  exports: [
    RouterModule
  ],
  entryComponents: [
    LoginModalComponent,
    ForgotPasswordModalComponent,
    SignupModalComponent,
    VerificationModalComponent
  ]
})
export class AppModule { }
