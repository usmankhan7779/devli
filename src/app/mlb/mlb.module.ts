import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, UrlSegment } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { NgxPaginationModule } from 'ngx-pagination';

import { MlbComponent } from './mlb.component';

import { LineupsGatewayComponent } from './lineups-gateway/lineups-gateway.component';
import { TeamLineupComponent } from './team-lineup/team-lineup.component';
import { CurrentTeamLineupComponent } from './team-lineup/current-team-lineup/current-team-lineup.component';
import { MatchupsComponent } from './matchups-gateway/matchups-gateway.component';
import { MatchupComponent } from './matchups-gateway/matchup/matchup.component';
import { BetPredictorComponent } from './bet-predictor/bet-predictor.component';
import { BetMetricsComponent } from './bet-metrics/bet-metrics.component';
import { DataMiningComponent } from './data-mining/data-mining.component';
import { NewsComponent } from './news/news.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { RosterComponent } from './roster/roster.component';
import { MatchupDetailsComponent } from './matchups-gateway/matchup-details/matchup-details.component';
import { PlayerStatsComponent } from './bet-predictor/player-stats/player-stats.component';
import { InjuriesComponent } from '../shared/components/injuries/injuries.component';
import { IndividualMatchupComponent } from './matchups-gateway/individual-matchup/individual-matchup.component';
import { MatchupNewsComponent } from './news/matchup-news/matchup-news.component';
import { InGamePredictorComponent } from './in-game-predictor/in-game-predictor.component';
import { LiveGameComponent } from './in-game-predictor/live-game/live-game.component';
import { PreGameComponent } from './in-game-predictor/pre-game/pre-game.component';
import { InGameBetsComponent } from './in-game-predictor/bets/bets.component';
import { BoxScoreComponent } from './in-game-predictor/box-score/box-score.component';
import { TeamScoreGameComponent } from './in-game-predictor/team-score-game/team-score-game.component';
import { AtBatPredictionComponent } from './in-game-predictor/at-bat-prediction/at-bat-prediction.component';
import { TeamLineupTableEditableComponent } from './bet-predictor/team-lineup-table-editable/team-lineup-table-editable.component';
import { TeamScheduleComponent } from './schedule/team-schedule/team-schedule.component';
import { LineupItemComponent } from './lineups-gateway/lineup-item/lineup-item.component';
import { NewsHomePageComponent } from '../shared/components/news-home-page/news-home-page.component';
import { PlayerPageComponent } from './player-page/player-page.component';
import { TeamLineupHeadingRightComponent } from './team-lineup/team-lineup-heading-right/team-lineup-heading-right.component';
import { BetPredictorNewsTabComponent } from './bet-predictor/bet-predictor-news-tab/bet-predictor-news-tab.component';
// tslint:disable-next-line:max-line-length
import { PredictionModelAccuracyResultsComponent } from '../shared/components/prediction-model-accuracy-results/prediction-model-accuracy-results.component';
import { RostersHomePageComponent } from '../shared/components/rosters-home-page/rosters-home-page.component';
import { StatsComponent } from './stats/stats.component';
import { StatsGatewayComponent } from './stats/stats-gateway/stats-gateway.component';
import { TeamsPageComponent } from '../shared/components/teams-page/teams-page.component';
import { ScheduleContentComponent } from './schedule/schedule-content/schedule-content.component';
import { TeamInjuriesComponent } from './team-injuries/team-injuries.component';
import { PlayersPageComponent } from '../shared/components/players-page/players-page.component';
// Services
import { LineupsGatewayService } from './lineups-gateway/lineups-gateway.service';
import { TeamLineupService } from './team-lineup/team-lineup.service';
import { BetMetricsService } from './bet-metrics/bet-metrics.service';
import { ScheduleService } from './schedule/schedule.service';
import { HomeComponent } from './home/home.component';
import { PlayerPageService } from './player-page/player-page.service';
import { StatsService } from './stats/stats.service';

// Resolvers
import { IndividualTeamLineupResolver } from './team-lineup/individual-team-lineup.resolver';
import { SingleMatchupResolver } from './matchups-gateway/single-matchup.resolver';
import { PlayerPageResolver } from './player-page/player-page.resolver';
import { RostersHomePageResolver } from './roster/rosters-home-page.resolver';
import { RosterResolver } from './roster/roster.resolver';
import { TeamScheduleResolver } from './schedule/team-schedule/team-schedule.resolver';
import { NewsResolver } from './news/news.resolver';
import { StatsGatewayResolver } from './stats/stats-gateway/stats.geteway.resolver';
import { StatsResolver } from './stats/stats.resolver';
import { TeamsResolver } from './teams/teams.resolver';
import { StandingsPageComponent } from '../shared/components/standings-page/standings-page.component';
import * as _ from 'lodash';
import { SharedChartsModule } from '../shared/shared-charts/shared-charts.module';
import { IframeDepthChartViewComponent } from './iframe-depth-chart-view/iframe-depth-chart-view.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

export const mlbRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: MlbComponent,
    data: {breadcrumb: 'MLB'},
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          breadcrumb: null,
        },
        pathMatch: 'full'
      },
      {
        path: 'iframe-depth-charts',
        pathMatch: 'full',
        component: IframeDepthChartViewComponent,
      },
      {
        path: 'vegas-odds/mlb-live-odds',
        pathMatch: 'full',
        redirectTo: '/vegas-odds/mlb-live-vegas-odds',
      },
      {
        path: 'jason-heyward',
        pathMatch: 'full',
        redirectTo: 'player-stats/jason-heyward',
      },
      {
        path: 'josh-reddick',
        pathMatch: 'full',
        redirectTo: 'player-stats/josh-reddick',
      },
      {
        path: 'matt-strahm',
        pathMatch: 'full',
        redirectTo: 'player-stats/matt-strahm',
      },
      {
        path: 'sandy-alcantara',
        pathMatch: 'full',
        redirectTo: 'player-stats/sandy-alcantara',
      },
      {
        path: 'yandy-diaz',
        pathMatch: 'full',
        redirectTo: 'player-stats/yandy-diaz',
      },
      {
        path: 'data-mining/insights',
        pathMatch: 'full',
        redirectTo: '/'
      },
      {
        path: 'data-mining/insights/:any',
        pathMatch: 'full',
        redirectTo: '/'
      },
      {
        path: '2017',
        pathMatch: 'full',
        redirectTo: ''
      },
      {
        path: 'news',
        component: NewsHomePageComponent,
        data: {
          title: 'MLB News',
          url: 'mlb'
        },
        pathMatch: 'full'
      },
      {
        path: 'rosters',
        component: RostersHomePageComponent,
        resolve: {
          rosters: RostersHomePageResolver
        },
        data: {
          league: 'mlb',
          title: 'DYNAMIC'
        },
        pathMatch: 'full'
      },
      {
        path: 'teams',
        component: TeamsPageComponent,
        resolve: {
          teamsData: TeamsResolver
        },
        data: {
          breadcrumb: 'Teams',
          title: 'MLB Teams',
          league: 'mlb'
        },
        pathMatch: 'full'
      },
      {
        path: 'rosters/:year',
        pathMatch: 'full',
        redirectTo: 'rosters'
        // component: RostersHomePageComponent,
        // resolve: {
        //   rosters: RostersHomePageResolver
        // },
        // data: {
        //   league: 'mlb',
        //   title: 'DYNAMIC'
        // },
      },
      {
        path: 'lineups/current',
        redirectTo: 'lineups'
      },
      {
        path: 'lineups',
        component: LineupsGatewayComponent,
        data: {
          title: 'MLB Lineups, MLB Starting Daily Lineups'
        },
        pathMatch: 'full'
      },
      {
        // path: 'lineups/:team_name',
        matcher: teamUrlMatcherLineup,
        component: TeamLineupComponent,
        resolve: {
          teamLineup: IndividualTeamLineupResolver
        },
        children: [
          {
            path: '',
            component: CurrentTeamLineupComponent,
            data: {title: 'DYNAMIC'},
          }
        ]
      },
      {
        path: 'lineups/:year',
        pathMatch: 'full',
        redirectTo: 'lineups'
      },
      {
        path: 'lineups/:active_year/:team_name',
        pathMatch: 'full',
        redirectTo: 'lineups/:team_name'
      },
      {
        path: 'roster',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },
      {
        path: 'roster/:active_year/:team_name',
        redirectTo: 'roster/:team_name',
      },
      {
        // path: 'roster/:team_name',
        matcher: teamUrlMatcherRoster,
        component: RosterComponent,
        resolve: {
          rosterData: RosterResolver
        }
      },
      {
        path: 'roster/:year',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
        data: {
          breadcrumb: 'MLB Schedule',
          title: 'MLB Schedule'
        }
      },
      {
        path: 'schedule/toront-blue-jays',
        pathMatch: 'full',
        redirectTo: 'schedule/toronto-blue-jays'
      },
      {
        // path: 'schedule/:team_name',
        matcher: teamUrlMatcherSchedule,
        component: TeamScheduleComponent,
        resolve: {
          scheduleData: TeamScheduleResolver
        }
      },
      {
        path: 'schedule/:year/:team_name',
        redirectTo: 'schedule/:team_name',
        // component: TeamScheduleComponent,
        // resolve: {
        //   scheduleData: TeamScheduleResolver
        // }
      },
      {
        path: 'schedule/:date',
        pathMatch: 'full',
        redirectTo: 'schedule'
      },
      {
        path: 'bet-metrics',
        // component: BetMetricsComponent,
        redirectTo: 'prediction-model-accuracy'
      },
      {
        path: 'matchups/:year/:date/:team_names',
        pathMatch: 'full',
        redirectTo: 'matchups'
      },
      {
        path: 'matchups',
        pathMatch: 'full',
        component: MatchupsComponent
      },
      {
        path: 'matchups/:team_names',
        component: IndividualMatchupComponent,
        resolve: {
          matchup: SingleMatchupResolver
        },
        children: [
          {
            path: '',
            component: MatchupDetailsComponent,
            data: {
              noFollow: true,
              title: 'DYNAMIC'
            },
          }
        ]
      },
      {
        path: 'lineups/:active_year/:team_name/data-mining',
        component: DataMiningComponent
      },
      {
        path: 'news/undefined',
        pathMatch: 'full',
        redirectTo: 'news'
      },
      {
        path: 'news/:team_name',
        component: NewsComponent,
        resolve: {
          data: NewsResolver
        }
      },
      {
        path: 'news/matchups/:team_names',
        redirectTo: 'news'
      },
      {
        path: 'betting-system',
        component: BetPredictorComponent,
        data: {
          title: 'MLB Betting System, MLB Betting Tool',
          breadcrumb: 'Betting System'
        }
      },
      {
        path: 'injuries',
        pathMatch: 'full',
        redirectTo: 'player-injuries'
      },
      {
        path: 'player-injuries',
        component: InjuriesComponent,
        data: {
          url: 'mlb',
          title: 'MLB Player Injuries'
        }
      },
      {
        path: 'players',
        component: PlayersPageComponent,
        data: {
          url: 'mlb',
        }
      },
      {
        path: 'player-injuries/:team_name',
        component: TeamLineupComponent,
        resolve: {
          teamLineup: IndividualTeamLineupResolver
        },
        data: {
          pageType: 'injuries'
        },
        children: [
          {
            path: '',
            component: TeamInjuriesComponent,
            data: {
              title: 'DYNAMIC'
            },
          }
        ]
      },
      {
        path: 'in-game-live-betting-system',
        component: InGamePredictorComponent,
        data: {
          title: 'MLB In-Game Predictor, Live Predictions',
          breadcrumb: 'In-Game Predictor'
        }
      },
      {
        path: 'prediction-model-accuracy',
        component: PredictionModelAccuracyResultsComponent,
        data: {
          league: 'mlb',
          breadcrumb: 'MLB Prediction Model Accuracy',
          title: 'MLB Prediction Machine Learning Model Accuracy',
        }
      },
      {
        path: 'player-stats',
        component: StatsGatewayComponent,
        resolve: {
          leadersData: StatsGatewayResolver
        }
      },
      {
        // path: 'player-stats/:year',
        matcher: leadersGatewayRedirectMatcher,
        component: StatsGatewayComponent,
        resolve: {
          leadersData: StatsGatewayResolver
        },
        data: {
          redirect: true
        }
      },
      {
        // path: 'player-stats/:year',
        matcher: leadersGatewayMatcher,
        component: StatsGatewayComponent,
        resolve: {
          leadersData: StatsGatewayResolver
        }
      },
      {
        matcher: statsRedirectMatcher,
        component: StatsComponent,
        resolve: {
          statsData: StatsResolver
        },
        data: {
          redirect: true
        }
      },
      {
        matcher: statsMatcher,
        component: StatsComponent,
        resolve: {
          statsData: StatsResolver
        }
      },
      {
        path: 'player-stats/:name',
        component: PlayerPageComponent,
        resolve: {
          playerData: PlayerPageResolver
        }
      },
      {
        path: 'player-stats/:name/:id',
        component: PlayerPageComponent,
        resolve: {
          playerData: PlayerPageResolver
        }
      },
      {
        path: 'standings',
        component: StandingsPageComponent,
        data: {
          league: 'mlb'
        }
      },
    ]
  }
]);


@NgModule({
  declarations: [
    LineupsGatewayComponent,
    TeamLineupComponent,
    CurrentTeamLineupComponent,
    MatchupsComponent,
    BetMetricsComponent,
    BetPredictorComponent,
    MatchupComponent,
    DataMiningComponent,
    NewsComponent,
    ScheduleComponent,
    MlbComponent,
    MatchupDetailsComponent,
    IndividualMatchupComponent,
    RosterComponent,
    PlayerStatsComponent,
    MatchupNewsComponent,
    InGamePredictorComponent,
    LiveGameComponent,
    PreGameComponent,
    InGameBetsComponent,
    BoxScoreComponent,
    TeamScoreGameComponent,
    AtBatPredictionComponent,
    HomeComponent,
    TeamLineupTableEditableComponent,
    TeamScheduleComponent,
    LineupItemComponent,
    BetPredictorNewsTabComponent,
    PlayerPageComponent,
    StatsComponent,
    StatsGatewayComponent,
    TeamLineupHeadingRightComponent,
    ScheduleContentComponent,
    TeamInjuriesComponent,
    IframeDepthChartViewComponent
  ],
  imports: [
    SharedModule,
    SharedChartsModule,
    RouterModule,
    NgbModule,
    FormsModule,
    NgxPageScrollCoreModule.forRoot({
      scrollOffset: 70,
      duration: 300
    }),
    NgxPageScrollModule,
    ReactiveFormsModule,
    DataTableModule,
    NgxPaginationModule,
    mlbRouting
  ],
  providers: [
    // Services
    LineupsGatewayService,
    TeamLineupService,
    BetMetricsService,
    ScheduleService,
    PlayerPageService,
    StatsService,
    // Resolvers
    SingleMatchupResolver,
    IndividualTeamLineupResolver,
    PlayerPageResolver,
    RosterResolver,
    RostersHomePageResolver,
    TeamScheduleResolver,
    NewsResolver,
    StatsGatewayResolver,
    StatsResolver,
    TeamsResolver
  ]
})
export class MlbModule {
}


export function teamUrlMatcher(firstUrlName, url: UrlSegment[]) {
  if (
    url.length === 2 && url[0].path === firstUrlName &&
    isNaN(Number(url[1].path.substring(0, 4))) &&
    isNaN(Number(url[1].path.substr(url[1].path.length - 4))) &&
    isNaN(Number(url[1].path))
  ) {
    return {
      consumed: url,
      posParams: {
        team_name: url[1]
      }
    };
  }
  return null;
}


export function teamUrlMatcherLineup(url: UrlSegment[]) {
  return teamUrlMatcher('lineups', url);
}
export function teamUrlMatcherRoster(url: UrlSegment[]) {
  return teamUrlMatcher('roster', url);
}
export function teamUrlMatcherSchedule(url: UrlSegment[]) {
  return teamUrlMatcher('schedule', url);
}

export function leadersGatewayMatcher(url: UrlSegment[]) {
  if (url.length === 2 && url[0].path === 'player-stats' && validateYear(url[1].path)) {
    return {
      consumed: url,
      posParams: {
        year: url[1]
      }
    };
  }
  if (url.length === 2 && url[0].path === 'player-stats' && _.includes(availableStatsLeagues, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        statsLeague: url[1]
      }
    };
  }
  if (url.length === 3 && url[0].path === 'player-stats' && _.includes(availableStatsLeagues, url[2].path) && validateYear(url[1].path)) {
    return {
      consumed: url,
      posParams: {
        statsLeague: url[2],
        year: url[1]
      }
    };
  }
  return null;
}
export function leadersGatewayRedirectMatcher(url: UrlSegment[]) {
  if (url.length === 3 && url[0].path === 'player-stats' && _.includes(availableStatsLeagues, url[1].path) && validateYear(url[2].path)) {
    return {
      consumed: url,
      posParams: {
        statsLeague: url[1],
        year: url[2]
      }
    };
  }
  return null;
}

export function validateYear(year) {
  return year.length === 4 && parseInt(year, 10).toString().length === 4;
}

export const availableStatsLeagues = [
  'american-league',
  'national-league'
];

export const availableStatsTypes = [
  'pitching-stats',
  'batting-stats',
];

export function statsRedirectMatcher(url: UrlSegment[]) {
  if (url.length && url[0].path === 'player-stats') {
    /*
      redirect routes are
      /mlb/player-stats/pitching-stats/:year
      /mlb/player-stats/batting-stats/:year
    */
    if (url.length === 3 && _.includes(availableStatsTypes, url[1].path) && validateYear(url[2].path)) {
      return {
        consumed: url,
        posParams: {
          statsType: url[1],
          year: url[2],
        }
      };
    }
    /*
      redirect routes are
      /mlb/player-stats/american-league/pitching-stats/:year
      /mlb/player-stats/american-league/batting-stats/:year
      /mlb/player-stats/national-league/pitching-stats/:year
      /mlb/player-stats/national-league/batting-stats/:year
    */
    if (url.length === 4 &&
      _.includes(availableStatsLeagues, url[1].path) && _.includes(availableStatsTypes, url[2].path) && validateYear(url[3].path)) {
      return {
        consumed: url,
        posParams: {
          statsLeague: url[1],
          statsType: url[2],
          year: url[3]
        }
      };
    }
    return null;
  }
  return null;
}
export function statsMatcher(url: UrlSegment[]) {
  if (url.length && url[0].path === 'player-stats') {
    /*
      available routes are
      /mlb/player-stats/pitching-stats
      /mlb/player-stats/batting-stats
    */
    if (url.length === 2 && _.includes(availableStatsTypes, url[1].path)) {
      return {
        consumed: url,
        posParams: {
          statsType: url[1]
        }
      };
    }
    /*
      available routes are
      /mlb/player-stats/:year/pitching-stats
      /mlb/player-stats/:year/batting-stats
    */
    if (url.length === 3 && _.includes(availableStatsTypes, url[2].path) && validateYear(url[1].path)) {
      return {
        consumed: url,
        posParams: {
          statsType: url[2],
          year: url[1]
        }
      };
    }
    /*
      available routes are
      /mlb/player-stats/american-league/pitching-stats
      /mlb/player-stats/american-league/batting-stats
      /mlb/player-stats/national-league/pitching-stats
      /mlb/player-stats/national-league/batting-stats
    */
    if (url.length === 3 && _.includes(availableStatsLeagues, url[1].path) && _.includes(availableStatsTypes, url[2].path)) {
      return {
        consumed: url,
        posParams: {
          statsLeague: url[1],
          statsType: url[2],
        }
      };
    }
    /*
      available routes are
      /mlb/player-stats/:year/american-league/pitching-stats
      /mlb/player-stats/:year/american-league/batting-stats
      /mlb/player-stats/:year/national-league/pitching-stats
      /mlb/player-stats/:year/national-league/batting-stats
    */
    if (url.length === 4 &&
      _.includes(availableStatsLeagues, url[2].path) && _.includes(availableStatsTypes, url[3].path) && validateYear(url[1].path)) {
      return {
        consumed: url,
        posParams: {
          statsLeague: url[2],
          statsType: url[3],
          year: url[1]
        }
      };
    }
    return null;
  }
  return null;
}
