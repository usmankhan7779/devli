import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, UrlSegment } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { SharedModule } from '../shared/shared.module';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
// Main Module Component
import { NflComponent } from './nfl.component';
import * as _ from 'lodash';

// Components
import { BetPredictorComponent } from './bet-predictor/bet-predictor.component';
import { BetsComponent } from './bets/bets.component';
import { DepthChartsComponent } from './depth-charts/depth-charts.component';
import { MatchupsGatewayComponent } from './matchups-gateway/matchups-gateway.component';
import { MatchupComponent } from './matchups-gateway/matchup/matchup.component';
import { MatchupDetailsComponent } from './matchups-gateway/matchup-details/matchup-details.component';
import { NewsComponent } from './news/news.component';
import { OwnershipComponent } from './ownership/ownership.component';
import { IndividualMatchupComponent } from './matchups-gateway/individual-matchup/individual-matchup.component';
import { InjuriesComponent } from '../shared/components/injuries/injuries.component';
import { IndividualDepthChartComponent } from './depth-charts/individual-depth-chart/individual-depth-chart.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MatchupNewsComponent } from './news/matchup-news/matchup-news.component';
import { TeamLineupTableEditableComponent } from './bet-predictor/team-lineup-table-editable/team-lineup-table-editable.component';
import { PlayerStatsComponent } from './bet-predictor/player-stats/player-stats.component';
import { InGamePredictorComponent } from './in-game-predictor/in-game-predictor.component';
import { RosterComponent } from './roster/roster.component';
import { GameScoreComponent } from './in-game-predictor/game-score/game-score.component';
import { LiveGameComponent } from './in-game-predictor/live-game/live-game.component';
import { PregameComponent } from './in-game-predictor/pregame/pregame.component';
import { BetsInGameComponent } from './in-game-predictor/bets/bets.component';
import { BoxScoreComponent } from './in-game-predictor/box-score/box-score.component';
import { HomeComponent } from './home/home.component';
import { TargetsGatewayComponent } from './targets-gateway/targets-gateway.component';
import { TargetsComponent } from './targets-gateway/targets/targets.component';
import { TeamScheduleComponent } from './schedule/team-schedule/team-schedule.component';
import { DepthChartSingleItemComponent } from './depth-charts/depth-chart-single-item/depth-chart-single-item.component';
import { BetPredictorNewsTabComponent } from './bet-predictor/bet-predictor-news-tab/bet-predictor-news-tab.component';

// tslint:disable-next-line:max-line-length
import { PredictionModelAccuracyResultsComponent } from '../shared/components/prediction-model-accuracy-results/prediction-model-accuracy-results.component';
import { NewsHomePageComponent } from '../shared/components/news-home-page/news-home-page.component';
import { PlayerPageComponent } from './player-page/player-page.component';
import { RostersHomePageComponent } from '../shared/components/rosters-home-page/rosters-home-page.component';
import { StatsComponent } from './stats/stats.component';
import { StatsGatewayComponent } from './stats/stats-gateway/stats-gateway.component';
import { TeamsPageComponent } from '../shared/components/teams-page/teams-page.component';
import { TeamInjuriesComponent } from './team-injuries/team-injuries.component';
import { TeamStatsComponent } from './teams/team-stats/team-stats.component';
import { TeamStatsGatewayComponent } from './teams/team-stats-gateway/team-stats-gateway.component';
import { StrengthOfScheduleComponent } from './schedule/strength-of-schedule/strength-of-schedule.component';
import { PlayersPageComponent } from '../shared/components/players-page/players-page.component';
import { TeamSnapCountsComponent } from './team-snap-counts-page/team-snap-counts.component';
import { ScheduleContentComponent } from './schedule/schedule-content/schedule-content.component';
import { StandingsPageComponent } from '../shared/components/standings-page/standings-page.component';
import { IndTeamStatsComponent } from './teams/ind-team-stats/ind-team-stats.component';
import { OffensePlayerBoxComponent } from './depth-charts/individual-depth-chart/offense-player-box/offense-player-box.component';
// Services
import { BetsService } from './bets/bets.service';
import { ScheduleService } from './schedule/schedule.service';
import { InGamePredictorService } from './in-game-predictor/in-game-predictor.service';
import { TargetsService } from './targets-gateway/targets.service';
import { PlayerPageService } from './player-page/player-page.service';
import { StatsService } from './stats/stats.service';
import { TeamService } from './teams/team.service';
import { TeamSnapCountsService } from './team-snap-counts-page/team-snap-counts.service';
import { TeamRankingsService } from './teams/team-rankings/team-rankings.service';
import { IndTeamStatsService } from './teams/ind-team-stats/ind-team-stats.service';

// Resolvers
import { SingleMatchupResolver } from './matchups-gateway/single-matchup.resolver';
import { ScheduleResolver } from './schedule/schedule.resolver';
import { PlayerPageResolver } from './player-page/player-page.resolver';
import { RostersHomePageResolver } from './roster/rosters-home-page.resolver';
import { StatsResolver } from './stats/stats.resolver';
import { StatsGatewayResolver } from './stats/stats-gateway/stats-gateway.resolver';
import { IndividualDepthChartResolver } from './depth-charts/individual-depth-chart/individual-depth-chart.resolver';
import { RosterResolver } from './roster/roster.resolver';
import { TeamScheduleResolver } from './schedule/team-schedule/team-schedule.resolver';
import { TeamsResolver } from './teams/teams.resolver';
import { StrengthOfScheduleResolver } from './schedule/strength-of-schedule/strength-of-schedule.resolver';
import { TeamStatsGatewayResolver } from './teams/team-stats-gateway/team-stats-gateway.resolver';
import { TeamStatsResolver } from './teams/team-stats/team-stats.resolver';
import { TeamSnapCountsResolver } from './team-snap-counts-page/team-snap-counts.resolver';
import { IndTeamStatsResolver } from './teams/ind-team-stats/ind-team-stats.resolver';
import { AlternativeDepthChartViewComponent } from './depth-charts/alternative-depth-chart-view/alternative-depth-chart-view.component';
import { IframeDepthChartViewComponent } from './iframe-depth-chart-view/iframe-depth-chart-view.component';
import { SharedChartsModule } from '../shared/shared-charts/shared-charts.module';
import { NoStatsComponent } from './stats/no-stats-component/no-stats.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

const nflRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: NflComponent,
    // canActivate: [ AuthGuard ],
    data: {breadcrumb: 'NFL'},
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
        path: 'vegas-odds/nfl-live-odds',
        pathMatch: 'full',
        redirectTo: '/vegas-odds/nfl-live-vegas-odds'
      },
      {
        path: '2017',
        pathMatch: 'full',
        redirectTo: ''
      },
      {
        path: 'player-statsjosh-reynolds',
        pathMatch: 'full',
        redirectTo: 'player-stats/josh-reynolds'
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
        path: 'undefined',
        pathMatch: 'full',
        redirectTo: ''
      },
      {
        path: '2017/wide-receiver-wr-redzone-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/wide-receiver-wr-snap-counts'
      },
      {
        path: '2017/nfl-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions'
      },
      {
        path: '2017/nfl-receptions/2017/running-back-rb-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/running-back-rb-receptions'
      },
      {
        path: '2017/nfl-receptions/2017/tight-end-te-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/tight-end-te-receptions'
      },
      {
        path: '2017/nfl-receptions/running-back-rb-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/running-back-rb-receptions'
      },
      {
        path: '2017/nfl-receptions/tight-end-te-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/tight-end-te-receptions'
      },
      {
        path: '2017/nfl-receptions/wide-receiver-wr-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/wide-receiver-wr-receptions'
      },
      {
        path: '2017/nfl-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets'
      },
      {
        path: '2017/nfl-targets/2017/running-back-rb-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets/running-back-rb-targets'
      },
      {
        path: '2017/nfl-targets/2017/tight-end-te-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets/tight-end-te-targets'
      },
      {
        path: '2017/nfl-targets/2017/wide-receiver-wr-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets/wide-receiver-wr-targets'
      },
      {
        path: '2017/player-stats/2017/running-back-rb-touches',
        pathMatch: 'full',
        redirectTo: 'player-stats/running-back-rb-touches'
      },
      {
        path: '2017/snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts'
      },
      {
        path: 'snap-counts/2017',
        pathMatch: 'full',
        redirectTo: 'snap-counts'
      },
      {
        path: 'snap-counts/2017/defensive-players-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/defensive-players-snap-counts'
      },
      {
        path: 'snap-counts/2017/offensive-line-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/offensive-line-snap-counts'
      },
      {
        path: '2017/snap-counts/2017/defensive-players-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/defensive-players-snap-counts'
      },
      {
        path: '2017/snap-counts/2017/offensive-line-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/offensive-line-snap-counts'
      },
      {
        path: '2017/snap-counts/defensive-players-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/defensive-players-snap-counts'
      },
      {
        path: '2017/snap-counts/offensive-line-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/offensive-line-snap-counts'
      },
      {
        path: '2017/snap-counts/quarterback-qb-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/quarterback-qb-snap-counts'
      },
      {
        path: '2017/snap-counts/running-back-rb-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/running-back-rb-snap-counts'
      },
      {
        path: '2017/snap-counts/tight-end-te-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/tight-end-te-snap-counts'
      },
      {
        path: '2017/snap-counts/wide-receiver-wr-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/wide-receiver-wr-snap-counts'
      },
      {
        path: '2018/snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts'
      },
      {
        path: 'nfl-receptions/2017',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions'
      },
      {
        path: 'nfl-targets/2017',
        pathMatch: 'full',
        redirectTo: 'nfl-targets'
      },
      {
        path: 'nfl-targets/2017/running-back-rb-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets/running-back-rb-targets'
      },
      {
        path: 'nfl-targets/2017/tight-end-te-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets/tight-end-te-targets'
      },
      {
        path: 'nfl-targets/2017/wide-receiver-wr-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets/wide-receiver-wr-targets'
      },
      {
        path: 'nfl-player-stats/nfl-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/wide-receiver-wr-receptions'
      },
      {
        path: 'nfl-player-stats/defense-players-stats',
        pathMatch: 'full',
        redirectTo: 'player-stats/defensive-players-stats'
      },
      {
        path: 'nfl-player-stats/running-back-rb-redzone-touches',
        pathMatch: 'full',
        redirectTo: 'running-back-rb-redzone-touches'
      },
      {
        path: 'nfl-player-stats/nfl-targets',
        pathMatch: 'full',
        redirectTo: 'nfl-targets'
      },
      {
        path: 'player-stats/nfl-receptions',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/wide-receiver-wr-receptions'
      },
      {
        path: 'nfl-player-stats/running-back-rb-redzone-rush-attempts',
        pathMatch: 'full',
        redirectTo: 'running-back-rb-redzone-rush-attempts'
      },
      {
        path: 'player-stats/running-back-rb-redzone-rush-attempts',
        pathMatch: 'full',
        redirectTo: 'running-back-rb-redzone-rush-attempts'
      },
      {
        path: 'nfl-player-stats/running-back-rb-touches',
        pathMatch: 'full',
        redirectTo: 'player-stats/running-back-rb-touches'
      },
      {
        path: 'players',
        component: PlayersPageComponent,
        data: {
          url: 'nfl',
        }
      },
      {
        path: 'teams',
        component: TeamsPageComponent,
        resolve: {
          teamsData: TeamsResolver
        },
        data: {
          breadcrumb: 'Teams',
          title: 'NFL Teams',
          league: 'nfl'
        },
        pathMatch: 'full'
      },
      {
        path: 'defense-players-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/defensive-players-snap-counts'
      },
      {
        path: 'runningback-rb-snap-counts',
        redirectTo: 'snap-counts/running-back-rb-snap-counts'
      },
      {
        path: 'snap-counts/runningback-rb-snap-counts',
        redirectTo: 'snap-counts/running-back-rb-snap-counts'
      },
      {
        path: 'runningback-rb-stats',
        redirectTo: 'player-stats/runningback-rb-stats'
      },
      {
        path: 'tight-end-te-stats',
        redirectTo: 'player-stats/tight-end-te-stats'
      },
      {
        path: 'quarterback-qb-stats',
        redirectTo: 'player-stats/quarterback-qb-stats'
      },
      {
        path: 'offensive-line-stats',
        redirectTo: 'player-stats'
      },
      {
        path: 'defense-players-stats',
        redirectTo: 'player-stats/defensive-players-stats'
      },
      {
        path: 'wide-receiver-wr-stats',
        redirectTo: 'player-stats/wide-receiver-wr-stats'
      },
      {
        matcher: snapCountRedirect,
        redirectTo: 'snap-counts/:redirectSnapType'
      },
      {
        matcher: targetsRedirect,
        redirectTo: 'nfl-targets/:redirectTargetType'
      },
      {
        matcher: playerStatsRedirectMatcher,
        redirectTo: 'player-stats/:redirectType'
      },
      {
        matcher: nflReceptionsRedirectMatcher,
        redirectTo: 'nfl-receptions/:redirectType'
      },
      {
        path: 'news',
        component: NewsHomePageComponent,
        data: {
          title: 'NFL News',
          url: 'nfl'
        },
        pathMatch: 'full'
      },
      {
        path: 'rosters',
        component: RostersHomePageComponent,
        resolve: {
          rosters: RostersHomePageResolver,
        },
        data: {
          league: 'nfl',
          title: 'DYNAMIC'
        },
        pathMatch: 'full'
      },
      {
        path: 'rosters/:year',
        pathMatch: 'full',
        redirectTo: 'rosters'
        // component: RostersHomePageComponent,
        // resolve: {
        //   rosters: RostersHomePageResolver,
        // },
        // data: {
        //   league: 'nfl',
        //   title: 'DYNAMIC'
        // },
      },
      {
        path: ':year/targets-touches',
        pathMatch: 'full',
        redirectTo: 'nfl-targets'
      },
      {
        path: 'targets-touches',
        pathMatch: 'full',
        redirectTo: 'nfl-targets'
      },
      {
        // path: 'nfl-targets/:year',
        matcher: nflTargetsYearMather,
        component: TargetsGatewayComponent,
        data: {
          showPos: true,
          targetType: 'Offense',
          type: 'targets',
          tableType: 'running-back-rb-targets'
        }
      },
      {
        path: 'nfl-targets',
        component: TargetsGatewayComponent,
        data: {
          showPos: true,
          targetType: 'Offense',
          type: 'targets',
          tableType: 'running-back-rb-targets'
        }
      },
      // {
      //   path: 'snap-counts/:year',
      //   component: TargetsGatewayComponent,
      //   data: {
      //     showPos: true,
      //     targetType: 'Offense',
      //     type: 'snaps',
      //     tableType: 'running-back-rb-rush-attempts'
      //   }
      // },
      {
        path: 'snap-counts',
        component: TargetsGatewayComponent,
        data: {
          showPos: true,
          targetType: 'Offense',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      // {
      //   path: 'nfl-receptions/:year',
      //   component: TargetsGatewayComponent,
      //   data: {
      //     showPos: true,
      //     targetType: 'Offense',
      //     type: 'receptions',
      //     tableType: 'running-back-rb-rush-attempts'
      //   }
      // },
      {
        path: 'nfl-receptions',
        component: TargetsGatewayComponent,
        data: {
          showPos: true,
          targetType: 'Offense',
          type: 'receptions',
          tableType: 'running-back-rb-rush-attempts'
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
          url: 'nfl',
          title: 'NFL Player Injuries'
        }
      },
      {
        path: 'player-injuries/:team_name',
        pathMatch: 'full',
        component: TeamInjuriesComponent,
        resolve: {
          depthChart: IndividualDepthChartResolver
        }
      },
      {
        path: 'simulator/undefined',
        pathMatch: 'full',
        redirectTo: 'simulator'
      },
      {
        path: 'schedule',
        pathMatch: 'full',
        component: ScheduleComponent,
        resolve: {
          scheduleData: ScheduleResolver
        },
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        // path: 'schedule/strength-of-schedule',
        matcher: strengthOfScheduleUrlMatcher,
        component: StrengthOfScheduleComponent,
        resolve: {
          scheduleData: StrengthOfScheduleResolver
        },
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        // path: 'snap-counts/atlanta-falcons-snap-counts',
        matcher: teamSnapCountsUrlMatcher,
        component: TeamSnapCountsComponent,
        resolve: {
          pageData: TeamSnapCountsResolver
        },
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        path: 'schedule/:year/:week/undefined',
        redirectTo: 'schedule/:year'
      },
      {
        // path: 'schedule/:year',
        // path: 'schedule/:week',

        // path: 'schedule/playoffs-schedule',
        // path: 'schedule/playoffs-schedule/:year',
        // path: 'schedule/playoffs-schedule/:week',

        // path: 'schedule/preseason-schedule',
        // path: 'schedule/preseason-schedule/:year',
        // path: 'schedule/preseason-schedule/:week',
        matcher: yearlyScheduleMatcherFunction,
        component: ScheduleComponent,
        resolve: {
          scheduleData: ScheduleResolver
        },
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        // path: 'schedule/:team_name',
        matcher: teamUrlMatcherSchedule,
        component: TeamScheduleComponent,
        resolve: {
          scheduleData: TeamScheduleResolver
        },
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        path: 'schedule/:year/:team_name/undefined',
        pathMatch: 'full',
        redirectTo: 'schedule/:team_name'
      },
      {
        path: 'schedule/:year/:team_name',
        pathMatch: 'full',
        redirectTo: 'schedule/:team_name'
      },
      {
        path: 'ownership',
        component: OwnershipComponent,
        data: {
          breadcrumb: 'Ownership',
          title: 'NFL Ownership'
        }
      },
      {
        path: 'bets',
        component: BetsComponent,
        data: {
          breadcrumb: 'Bets',
          title: 'Today\'s NFL Bets'
        }
      },
      {
        path: 'depth-charts or',
        pathMatch: 'full',
        redirectTo: 'depth-charts'
      },
      {
        path: 'depth',
        pathMatch: 'full',
        redirectTo: 'depth-charts'
      },
      {
        path: 'depth-charts',
        component: DepthChartsComponent,
        pathMatch: 'full',
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        path: 'depth-charts/:year/:team_name/undefined',
        pathMatch: 'full',
        redirectTo: 'depth-charts/:team_name'
      },
      {
        path: 'depth_charts/:year/:team_name',
        pathMatch: 'full',
        redirectTo: 'depth-charts/:team_name'
      },
      {
        matcher: teamUrlRedirectMatcherDepthCharts,
        redirectTo: 'depth-charts/:team_name'
      },
      {
        // path: 'depth-charts/:team_name',
        matcher: teamUrlMatcherDepthCharts,
        component: IndividualDepthChartComponent,
        resolve: {
          depthChart: IndividualDepthChartResolver
        },
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        path: 'depth-charts/:year/:team_name',
        pathMatch: 'full',
        redirectTo: 'depth-charts/:team_name'
      },
      {
        path: 'depth-charts/:year',
        pathMatch: 'full',
        redirectTo: 'depth-charts'
      },
      {
        path: 'matchups',
        pathMatch: 'full',
        component: MatchupsGatewayComponent,
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        path: 'news/undefined',
        pathMatch: 'full',
        redirectTo: 'news'
      },
      {
        path: 'news/:team_name/undefined',
        pathMatch: 'full',
        redirectTo: 'news/:team_name'
      },
      {
        path: 'news/:team_name',
        pathMatch: 'full',
        component: NewsComponent,
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        path: 'news/matchups/:team_names',
        pathMatch: 'full',
        redirectTo: 'news'
      },
      {
        path: 'roster',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },

      {
        path: 'roster/:active_year/:team_name/undefined',
        pathMatch: 'full',
        redirectTo: 'roster/:team_name'
      },
      {
        path: 'roster/:active_year/:team_name',
        pathMatch: 'full',
        redirectTo: 'roster/:team_name'
      },
      {
        // path: 'roster/:team_name',
        matcher: teamUrlMatcherRoster,
        component: RosterComponent,
        resolve: {
          rosterData: RosterResolver
        },
        data: {
          title: 'DYNAMIC'
        }
      },
      {
        path: 'roster/:year',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },
      {
        path: ':year/nfl-targets/wide-receiver-wr-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'targets',
          tableType: 'wide-receiver-wr-targets'
        }
      },
      {
        path: 'nfl-targets/wide-receiver-wr-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'targets',
          tableType: 'wide-receiver-wr-targets'
        }
      },
      {
        path: ':year/nfl-targets/running-back-rb-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'targets',
          tableType: 'running-back-rb-targets'
        }
      },
      {
        path: 'nfl-targets/running-back-rb-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'targets',
          tableType: 'running-back-rb-targets'
        }
      },
      {
        path: ':year/nfl-targets/tight-end-te-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'targets',
          tableType: 'tight-end-te-targets'
        }
      },
      {
        path: 'nfl-targets/tight-end-te-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'targets',
          tableType: 'tight-end-te-targets'
        }
      },
      {
        path: 'nfl-player-stats/wide-receiver-wr-redzone-targets',
        redirectTo: 'wide-receiver-wr-redzone-targets'
      },
      {
        path: 'nfl-player-stats/running-back-rb-redzone-receptions',
        redirectTo: 'running-back-rb-redzone-receptions'
      },
      {
        path: 'nfl-player-stats/tight-end-te-redzone-targets',
        redirectTo: 'tight-end-te-redzone-targets'
      },
      {
        path: 'nfl-player-stats/running-back-rb-redzone-targets',
        redirectTo: 'running-back-rb-redzone-targets'
      },
      {
        path: 'nfl-player-stats/wide-receiver-wr-redzone-receptions',
        redirectTo: 'wide-receiver-wr-redzone-receptions'
      },
      {
        path: ':year/wide-receiver-wr-redzone-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'redzone-targets',
          tableType: 'wide-receiver-wr-redzone-targets'
        }
      },
      {
        path: 'wide-receiver-wr-redzone-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'redzone-targets',
          tableType: 'wide-receiver-wr-redzone-targets'
        }
      },
      {
        path: ':year/running-back-rb-redzone-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-targets',
          tableType: 'running-back-rb-targets'
        }
      },
      {
        path: 'running-back-rb-redzone-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-targets',
          tableType: 'running-back-rb-targets'
        }
      },
      {
        path: 'player-stats/:year/running-back-rb-rush-attempts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'rush',
          tableType: 'running-back-rb-redzone-touches'
        }
      },
      {
        path: 'player-stats/running-back-rb-rush-attempts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'rush',
          tableType: 'running-back-rb-redzone-touches'
        }
      },
      {
        path: ':year/running-back-rb-redzone-rush-attempts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-rush',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'running-back-rb-redzone-rush-attempts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-rush',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'player-stats/:year/running-back-rb-touches',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'touches',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'player-stats/running-back-rb-touches',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'touches',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/wide-receiver-wr-touches',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/wide-receiver-wr-receptions'
      },
      {
        path: 'wide-receiver-wr-touches',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/wide-receiver-wr-receptions'
      },
      {
        path: ':year/tight-end-te-touches',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/tight-end-te-receptions'
      },
      {
        path: 'tight-end-te-touches',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/tight-end-te-receptions'
      },
      {
        path: ':year/running-back-rb-redzone-touches',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-touches',
          // tableType: 'running-back-rb-redzone-touches'
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'running-back-rb-redzone-touches',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-touches',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/wide-receiver-wr-redzone-touches',
        redirectTo: 'wide-receiver-wr-redzone-receptions'
      },
      {
        path: 'wide-receiver-wr-redzone-touches',
        redirectTo: 'wide-receiver-wr-redzone-receptions'
      },
      {
        path: ':year/tight-end-te-redzone-touches',
        redirectTo: 'tight-end-te-redzone-receptions',
      },
      {
        path: 'tight-end-te-redzone-touches',
        redirectTo: 'tight-end-te-redzone-receptions',
      },
      {
        path: ':year/tight-end-te-redzone-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'redzone-targets',
          tableType: 'wide-receiver-wr-redzone-targets'
        }
      },
      {
        path: 'tight-end-te-redzone-targets',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'redzone-targets',
          tableType: 'wide-receiver-wr-redzone-targets'
        }
      },
      {
        path: 'snap-counts/:year/quarterback-qb-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'QB',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'snap-counts/quarterback-qb-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'QB',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/quarterback-qb-redzone-snap-counts',
        redirectTo: 'snap-counts/quarterback-qb-snap-counts'
      },
      {
        path: 'quarterback-qb-redzone-snap-counts',
        redirectTo: 'snap-counts/quarterback-qb-snap-counts'
        // component: TargetsGatewayComponent,
        // data: {
        //   targetType: 'QB',
        //   type: 'redzone-snaps',
        //   tableType: 'running-back-rb-rush-attempts'
        // }
      },
      {
        path: 'snap-counts/:year/running-back-rb-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'snap-counts/running-back-rb-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/running-back-rb-redzone-snap-counts',
        redirectTo: 'snap-counts/running-back-rb-snap-counts'
      },
      {
        path: 'running-back-rb-redzone-snap-counts',
        redirectTo: 'snap-counts/running-back-rb-snap-counts'
        // component: TargetsGatewayComponent,
        // data: {
        //   targetType: 'RB',
        //   type: 'redzone-snaps',
        //   tableType: 'running-back-rb-rush-attempts'
        // }
      },
      {
        path: 'snap-counts/:year/tight-end-te-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'snap-counts/tight-end-te-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/tight-end-te-redzone-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/tight-end-te-snap-counts'
      },
      {
        path: 'tight-end-te-redzone-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/tight-end-te-snap-counts'
      },
      {
        path: 'snap-counts/:year/offensive-line-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'OL',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'snap-counts/offensive-line-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'OL',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/offensive-line-redzone-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/offensive-line-snap-counts'
      },
      {
        path: 'offensive-line-redzone-snap-counts',
        pathMatch: 'full',
        redirectTo: 'snap-counts/offensive-line-snap-counts'
      },
      {
        path: 'snap-counts/:year/wide-receiver-wr-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'snap-counts/wide-receiver-wr-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/wide-receiver-wr-redzone-snap-counts',
        redirectTo: 'snap-counts/wide-receiver-wr-snap-counts'
      },
      {
        path: 'wide-receiver-wr-redzone-snap-counts',
        redirectTo: 'snap-counts/wide-receiver-wr-snap-counts'
        // component: TargetsGatewayComponent,
        // data: {
        //   targetType: 'WR',
        //   type: 'redzone-snaps',
        //   tableType: 'running-back-rb-rush-attempts'
        // }
      },
      {
        path: 'snap-counts/:year/defensive-players-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'D',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'snap-counts/defensive-players-snap-counts',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'D',
          type: 'snaps',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/wide-receiver-wr-redzone-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'redzone-receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'wide-receiver-wr-redzone-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'redzone-receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/wide-receiver-wr-redzone-catches',
        redirectTo: 'wide-receiver-wr-redzone-receptions'
      },
      {
        path: 'wide-receiver-wr-redzone-catches',
        redirectTo: 'wide-receiver-wr-redzone-receptions'
      },
      {
        path: 'nfl-receptions/:year/wide-receiver-wr-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'nfl-receptions/wide-receiver-wr-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'WR',
          type: 'receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/wide-receiver-wr-catches',
        redirectTo: 'nfl-receptions/wide-receiver-wr-receptions',
      },
      {
        path: 'wide-receiver-wr-catches',
        redirectTo: 'nfl-receptions/wide-receiver-wr-receptions',
      },
      {
        path: ':year/tight-end-te-redzone-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'redzone-receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'tight-end-te-redzone-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'redzone-receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/tight-end-te-redzone-catches',
        redirectTo: 'tight-end-te-redzone-receptions'
      },
      {
        path: 'tight-end-te-redzone-catches',
        redirectTo: 'tight-end-te-redzone-receptions'
      },
      {
        path: 'nfl-receptions/:year/tight-end-te-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'nfl-receptions/tight-end-te-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'TE',
          type: 'receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/tight-end-te-catches',
        redirectTo: 'nfl-receptions/tight-end-te-receptions',
      },
      {
        path: 'tight-end-te-catches',
        redirectTo: 'nfl-receptions/tight-end-te-receptions',
      },
      {
        path: ':year/running-back-rb-redzone-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'running-back-rb-redzone-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'redzone-receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/running-back-rb-redzone-catches',
        redirectTo: 'running-back-rb-redzone-receptions'
      },
      {
        path: 'running-back-rb-redzone-catches',
        redirectTo: 'running-back-rb-redzone-receptions'
      },
      {
        path: 'nfl-receptions/:year/running-back-rb-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: 'nfl-receptions/running-back-rb-receptions',
        component: TargetsGatewayComponent,
        data: {
          targetType: 'RB',
          type: 'receptions',
          tableType: 'running-back-rb-rush-attempts'
        }
      },
      {
        path: ':year/running-back-rb-catches',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/running-back-rb-receptions',
      },
      {
        path: 'running-back-rb-catches',
        pathMatch: 'full',
        redirectTo: 'nfl-receptions/running-back-rb-receptions',
      },
      {
        path: 'depth-charts/:active_year/:team_name/news',
        pathMatch: 'full',
        redirectTo: 'news/:team_name',
      },
      {
        path: 'matchups/nfl/matchups/:year/:date/:team_names',
        pathMatch: 'full',
        redirectTo: 'matchups'
      },
      {
        path: 'matchups/:year/:date/:team_names',
        pathMatch: 'full',
        redirectTo: 'matchups'
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
        path: 'betting-system-',
        pathMatch: 'full',
        redirectTo: 'betting-system'
      },
      {
        path: 'betting-system',
        component: BetPredictorComponent,
        data: {
          title: 'NFL Betting System',
          breadcrumb: 'Betting System'
        }
      },
      {
        path: 'in-game-live-betting-system',
        component: InGamePredictorComponent,
        data: {
          title: 'NFL In Game Live Betting System, NFL Live Bet Predictions',
          breadcrumb: 'In-Game Predictor'
        }
      },
      {
        path: 'prediction-model-accuracy-',
        pathMatch: 'full',
        redirectTo: 'prediction-model-accuracy'
      },
      {
        path: 'prediction-model-accuracy',
        component: PredictionModelAccuracyResultsComponent,
        data: {
          league: 'nfl',
          breadcrumb: 'NFL Prediction Model Accuracy',
          title: 'NFL Prediction Machine Learning Model Accuracy',
        }
      },
      {
        path: ':year/nfl-player-stats/:type',
        pathMatch: 'full',
        redirectTo: 'player-stats/:year/:type'
      },
      {
        path: 'nfl-player-stats',
        pathMatch: 'full',
        redirectTo: 'player-stats'
      },
      {
        path: 'player-stats',
        pathMatch: 'full',
        component: StatsGatewayComponent,
        resolve: {
          leadersData: StatsGatewayResolver
        }
      },
      {
        // path: 'player-stats/:year',
        matcher: nflPlayerStatsYearMatcher,
        // pathMatch: 'full',
        // component: StatsGatewayComponent,
        // resolve: {
        //   statsData: StatsGatewayResolver
        // }
        redirectTo: 'player-stats'
      },
      {
        // path: 'player-stats/:type',
        matcher: playerStatsTypeMatcher,
        component: StatsComponent,
        resolve: {
          statsData: StatsResolver
        }
      },
      {
        path: 'team-stats',
        pathMatch: 'full',
        component: TeamStatsGatewayComponent,
        resolve: {
          teamStatsData: TeamStatsGatewayResolver
        }
      },
      {
        // path: 'team-stats/:type',
        matcher: teamStatsMatcher,
        pathMatch: 'full',
        component: TeamStatsComponent,
        resolve: {
          teamStatsData: TeamStatsResolver
        }
      },
      {
        path: 'team-stats/:team_name',
        pathMatch: 'full',
        component: IndTeamStatsComponent,
        resolve: {
          pageData: IndTeamStatsResolver
        }
      },
      {
        path: 'teams/stats/:team_name',
        pathMatch: 'full',
        redirectTo: 'team-stats/:team_name'
      },
      {
        path: 'team/stats/:team_name',
        pathMatch: 'full',
        redirectTo: 'team-stats/:team_name'
      },
      {
        path: 'teams/stat/:team_name',
        pathMatch: 'full',
        redirectTo: 'team-stats/:team_name'
      },
      {
        path: 'teams/stats/current/:team_name',
        pathMatch: 'full',
        redirectTo: 'team-stats/:team_name'
      },
      {
        path: 'standings',
        component: StandingsPageComponent,
        data: {
          league: 'nfl'
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
        path: 'iframe-depth-charts',
        component: IframeDepthChartViewComponent,
      }
    ]
  }
]);


@NgModule({
  declarations: [
    BetPredictorComponent,
    BetsComponent,
    DepthChartsComponent,
    MatchupsGatewayComponent,
    MatchupComponent,
    MatchupDetailsComponent,
    NflComponent,
    IndividualMatchupComponent,
    IndividualDepthChartComponent,
    ScheduleComponent,
    OwnershipComponent,
    NewsComponent,
    MatchupNewsComponent,
    OwnershipComponent,
    TeamLineupTableEditableComponent,
    PlayerStatsComponent,
    InGamePredictorComponent,
    RosterComponent,
    GameScoreComponent,
    LiveGameComponent,
    PregameComponent,
    BetsInGameComponent,
    BoxScoreComponent,
    HomeComponent,
    TargetsGatewayComponent,
    TargetsComponent,
    TeamScheduleComponent,
    BetPredictorNewsTabComponent,
    DepthChartSingleItemComponent,
    StatsComponent,
    StatsGatewayComponent,
    PlayerPageComponent,
    ScheduleContentComponent,
    TeamInjuriesComponent,
    StrengthOfScheduleComponent,
    TeamStatsGatewayComponent,
    TeamStatsComponent,
    TeamSnapCountsComponent,
    IndTeamStatsComponent,
    OffensePlayerBoxComponent,
    AlternativeDepthChartViewComponent,
    IframeDepthChartViewComponent,
    NoStatsComponent
  ],
  imports: [
    NgbModule,
    SharedModule,
    SharedChartsModule,
    NgxPageScrollCoreModule.forRoot({
      scrollOffset: 70,
      duration: 300
    }),
    NgxPageScrollModule,
    NgxPaginationModule,
    DataTableModule,
    nflRouting
  ],
  providers: [
    BetsService,
    ScheduleService,
    SingleMatchupResolver,
    InGamePredictorService,
    TargetsService,
    TeamService,
    TeamSnapCountsService,
    PlayerPageService,
    TeamRankingsService,
    IndTeamStatsService,
    // Resolvers
    ScheduleResolver,
    TeamsResolver,
    PlayerPageResolver,
    RostersHomePageResolver,
    StatsService,
    StatsResolver,
    StatsGatewayResolver,
    IndividualDepthChartResolver,
    RosterResolver,
    TeamScheduleResolver,
    StrengthOfScheduleResolver,
    TeamStatsGatewayResolver,
    TeamStatsResolver,
    TeamSnapCountsResolver,
    IndTeamStatsResolver
  ]
})
export class NflModule { }


export function validateYear(year) {
  return year.length === 4 && parseInt(year, 10).toString().length === 4;
}

export const availableScheduleNonWeekSeasons = [
  'playoffs-schedule',
  'preseason-schedule'
];

export function yearlyScheduleMatcherFunction(url: UrlSegment[]) {
  if (url.length && url[0].path === 'schedule') {
    if (url.length === 2 &&
      url[0].path === 'schedule' &&
      !url[1].path.startsWith('week-') &&
      validateYear(url[1].path) && url[1] &&
      (_.isEmpty(url[1].parameters) || (_.size(url[1].parameters) === 1 && url[1].parameters.week === '2017'))) {
      return {
        consumed: url,
        posParams: {
          year: url[1]
        }
      };
    }
    if (url.length === 3 && url[0].path === 'schedule' && validateYear(url[1].path) && url[2].path.startsWith('week-')
    ) {
      return {
        consumed: url,
        posParams: {
          year: url[1],
          week: url[2]
        }
      };
    }
    if (url.length === 2 &&
      url[0].path === 'schedule' &&
      url[1].path.startsWith('week-') &&
      !isNaN(parseInt(url[1].path.replace('week-', ''), 10))) {
      return {
        consumed: url,
        posParams: {
          week: url[1]
        }
      };
    }
    if (url.length === 3 &&
      url[0].path === 'schedule' &&
      _.includes(availableScheduleNonWeekSeasons, url[1].path) &&
      !url[2].path.startsWith('week-') &&
      validateYear(url[2].path) && url[2] &&
      _.isEmpty(url[2].parameters)) {
      return {
        consumed: url,
        posParams: {
          seasonType: url[1],
          year: url[2]
        }
      };
    }
    if (url.length === 2 &&
      url[0].path === 'schedule' && _.includes(availableScheduleNonWeekSeasons, url[1].path)) {
      return {
        consumed: url,
        posParams: {
          seasonType: url[1],
        }
      };
    }
    return null;
  }
  return null;
}

export const snapCountRedirectList = [
  'quarterback-qb-snap-counts',
  'running-back-rb-snap-counts',
  'wide-receiver-wr-snap-counts',
  'tight-end-te-snap-counts',
  'offensive-line-snap-counts',
  'defensive-players-snap-counts'
];

export function snapCountRedirect(url: UrlSegment[]) {
  if (url.length === 1 && _.includes(snapCountRedirectList, url[0].path)) {
    return {
      consumed: url,
      posParams: {
        redirectSnapType: url[0],
      }
    };
  }
  if (url.length === 2 && validateYear(url[0].path) && _.includes(snapCountRedirectList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        year: url[0],
        redirectSnapType: url[1]
      }
    };
  }
  return null;
}

export const targetsRedirectList = [
  'running-back-rb-targets',
  'wide-receiver-wr-targets',
  'tight-end-te-targets'
];

export function targetsRedirect(url: UrlSegment[]) {
  if (url.length === 1 && _.includes(targetsRedirectList, url[0].path)) {
    return {
      consumed: url,
      posParams: {
        redirectTargetType: url[0],
      }
    };
  }
  if (url.length === 2 && (url[0].path === 'nfl-player-stats' || url[0].path === 'player-stats')
    && _.includes(targetsRedirectList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        redirectTargetType: url[1]
      }
    };
  }
  if (url.length === 2 && validateYear(url[0].path) && _.includes(targetsRedirectList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        year: url[0],
        redirectTargetType: url[1]
      }
    };
  }
  return null;
}

export const playerStatsRedirectList = [
  'running-back-rb-rush-attempts',
  'running-back-rb-touches',
];

export const playerStatsTypeList = [
  'running-back-rb-rush-attempts',
  'runningback-rb-stats',
  'quarterback-qb-stats',
  'defensive-players-stats',
  'kicker-stats',
  'wide-receiver-wr-stats',
  'tight-end-te-stats',
];

export function playerStatsRedirectMatcher(url: UrlSegment[]) {
  if (url.length === 1 && _.includes(playerStatsRedirectList, url[0].path)) {
    return {
      consumed: url,
      posParams: {
        redirectType: url[0],
      }
    };
  }
  if (url.length === 2 && url[0].path === 'nfl-player-stats' && _.includes(playerStatsTypeList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        redirectType: url[1],
      }
    };
  }
  if (url.length === 2 && validateYear(url[0].path) && _.includes(playerStatsRedirectList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        // year: url[1],
        redirectType: url[1]
      }
    };
  }
  if (url.length === 3 && url[0].path === 'nfl-player-stats' && validateYear(url[1].path) && _.includes(playerStatsTypeList, url[2].path)) {
    return {
      consumed: url,
      posParams: {
        // year: url[1],
        redirectType: url[2]
      }
    };
  }
  return null;
}

export function playerStatsTypeMatcher(url: UrlSegment[]) {
  if (url.length === 2 && url[0].path === 'player-stats' && _.includes(playerStatsTypeList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        type: url[1],
      }
    };
  }
  if (url.length === 3 && url[0].path === 'player-stats' && validateYear(url[1].path) && _.includes(playerStatsTypeList, url[2].path)) {
    return {
      consumed: url,
      posParams: {
        year: url[1],
        type: url[2]
      }
    };
  }
  return null;
}

export const nflReceptionsRedirectList = [
  'running-back-rb-receptions',
  'wide-receiver-wr-receptions',
  'tight-end-te-receptions',
];

export function nflReceptionsRedirectMatcher(url: UrlSegment[]) {
  if (url.length === 1 && _.includes(nflReceptionsRedirectList, url[0].path)) {
    return {
      consumed: url,
      posParams: {
        redirectType: url[0],
      }
    };
  }
  if (url.length === 2 && (url[0].path === 'nfl-player-stats' || url[0].path === 'player-stats')
    && _.includes(nflReceptionsRedirectList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        redirectType: url[1],
      }
    };
  }
  if (url.length === 2 && validateYear(url[0].path) && _.includes(nflReceptionsRedirectList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        year: url[0],
        redirectType: url[1]
      }
    };
  }
  return null;
}

export function teamUrlMatcher(firstUrlName, url: UrlSegment[]) {
  if (url.length === 2 && url[0].path === firstUrlName && isNaN(Number(url[1].path.substring(0, 4))) && isNaN(Number(url[1].path))) {
    return {
      consumed: url,
      posParams: {
        team_name: url[1]
      }
    };
  }
  return null;
}

export function nflYearMather(route, url: UrlSegment[]) {
  if (url.length === 2 && url[0].path === route && url[1].path.length === 4 && !isNaN(Number(url[1].path))) {
    return {
      consumed: url,
      posParams: {
        year: url[1]
      }
    };
  }
  return null;
}


export function nflTargetsYearMather(url: UrlSegment[]) {
  return nflYearMather('nfl-targets', url);
}
export function nflPlayerStatsYearMatcher(url: UrlSegment[]) {
  return nflYearMather('player-stats', url);
}
export function teamUrlMatcherDepthCharts(url: UrlSegment[]) {
  return teamUrlMatcher('depth-charts', url);
}
export function teamUrlRedirectMatcherDepthCharts(url: UrlSegment[]) {
  return teamUrlMatcher('depth_charts', url);
}
export function teamUrlMatcherRoster(url: UrlSegment[]) {
  return teamUrlMatcher('roster', url);
}
export function teamUrlMatcherSchedule(url: UrlSegment[]) {
  if (url.length === 2 && url[0].path === 'schedule' &&
    isNaN(Number(url[1].path.substring(0, 4))) &&
    !url[1].path.startsWith('week-') && isNaN(Number(url[1].path))) {
    return {
      consumed: url,
      posParams: {
        team_name: url[1]
      }
    };
  }
  return null;
}

export function strengthOfScheduleUrlMatcher(url: UrlSegment[]) {
  if (url.length && url[0].path === 'schedule') {
    if (url.length === 2 && url[1].path === 'strength-of-schedule') {
      return {
        consumed: url
      };
    }
    if (url.length === 3 && url[2].path === 'strength-of-schedule' && validateYear(url[1].path)) {
      return {
        consumed: url,
        posParams: {
          year: url[1]
        }
      };
    }
    return null;
  }
  return null;
}

export function teamSnapCountsUrlMatcher(url: UrlSegment[]) {
  if (url.length === 2 && url[0].path === 'snap-counts' &&
    url[1].path.endsWith('-snap-counts') && !_.includes(snapCountRedirectList, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        team_name: url[1]
      }
    };
  }
  return null;
}

export const availableTeamStats = [
  'offense',
  'defense',
  'special-teams'
];

export function teamStatsMatcher(url: UrlSegment[]) {
  if (url.length === 2 && url[0].path === 'team-stats' &&
    _.includes(availableTeamStats, url[1].path)) {
    return {
      consumed: url,
      posParams: {
        type: url[1]
      }
    };
  }
  return null;
}
