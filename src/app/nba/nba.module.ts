import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, UrlSegment } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

// Components
import { HomeComponent } from './home/home.component';
import { NbaComponent } from './nba.component';
import { MatchupsGatewayComponent } from './matchups-gateway/matchups-gateway.component';
import { LineupsGatewayComponent } from './lineups-gateway/lineups-gateway.component';
import { MatchupComponent } from './matchups-gateway/matchup/matchup.component';
import { IndividualMatchupComponent } from './matchups-gateway/individual-matchup/individual-matchup.component';
import { MatchupDetailsComponent } from './matchups-gateway/matchup-details/matchup-details.component';
import { RostersHomePageComponent } from '../shared/components/rosters-home-page/rosters-home-page.component';
import { TeamLineupComponent } from './team-lineup/team-lineup.component';
import { CurrentTeamLineupComponent } from './team-lineup/current-team-lineup/current-team-lineup.component';
import { RosterComponent } from './roster/roster.component';
import { MatchupNewsComponent } from './news/matchup-news/matchup-news.component';
import { NewsComponent } from './news/news.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TeamScheduleComponent } from './schedule/team-schedule/team-schedule.component';
import { InjuriesComponent } from '../shared/components/injuries/injuries.component';
import { NewsHomePageComponent } from '../shared/components/news-home-page/news-home-page.component';
import { TeamsPageComponent } from '../shared/components/teams-page/teams-page.component';
import { ScheduleContentComponent } from './schedule/schedule-content/schedule-content.component';
import { TeamInjuriesComponent } from './team-injuries/team-injuries.component';
import { PlayersPageComponent } from '../shared/components/players-page/players-page.component';
// Services
import { TeamLineupService } from './team-lineup/team-lineup.service';
import { LineupsGatewayService } from './lineups-gateway/lienups.service';
// import { ScheduleService } from './schedule/schedule.service';
// Resolvers
import { IndividualRosterResolver } from './roster/individual-roster.resolver';
import { IndividualTeamLineupResolver } from './team-lineup/individual-team-lineup.resolver';
import { SingleMatchupResolver } from './matchups-gateway/single-matchup.resolver';
import { IndividualTeamNewsResolver } from './news/individual-team-news.resolver';
import { TeamScheduleResolver } from './schedule/team-schedule/team-schedule.resolver';
import { RostersHomePageResolver } from './roster/rosters-home-page.resolver';
import { MinutesResolver } from './minutes/minutes.resolver';
import { TeamsResolver } from './teams/teams.resolver';
import { StandingsPageComponent } from '../shared/components/standings-page/standings-page.component';
import { IndividualDepthChartResolver } from './depth-charts/individual-depth-chart/individual-depth-chart.resolver';
import { IndividualDepthChartComponent } from './depth-charts/individual-depth-chart/individual-depth-chart.component';
import { OffensePlayerBoxComponent } from './depth-charts/individual-depth-chart/offense-player-box/offense-player-box.component';
import { DepthChartsComponent } from './depth-charts/depth-charts.component';
import { IframeDepthChartViewComponent } from './iframe-depth-chart-view/iframe-depth-chart-view.component';
import { SharedChartsModule } from '../shared/shared-charts/shared-charts.module';
import { DepthChartSingleItemModule } from './depth-charts/depth-chart-single-item/depth-chart-single-item.module';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NbaTeamStatsComponent } from './teams/nba-team-stats/nba-team-stats.component';
import { NbaTeamStatsResolver } from './teams/nba-team-stats/nba-team-stats.resolver';
import { NbaTeamStatsService } from './teams/nba-team-stats/nba-team-stats.service';
import { NoNbaStatsComponent } from './stats/no-nba-stats-component/no-nba-stats.component';
import { TeamService } from 'app/nfl/teams/team.service';
import { TeamRankingsService } from 'app/nfl/teams/team-rankings/team-rankings.service';
import { IndTeamStatsService } from 'app/nfl/teams/ind-team-stats/ind-team-stats.service';
// import { ScheduleService } from './schedule/schedule.service';
import { PreselectNflScheduleTeamSeasonDirective } from 'app/shared/directives/nfl/preselect-nfl-schedule-team-season.directive';
import { ScheduleService } from 'app/nfl/schedule/schedule.service';

const nbaRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: NbaComponent,
    data: {breadcrumb: 'NBA'},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
        data: {
          breadcrumb: null,
        }
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
        path: 'free-nba-live-odds',
        pathMatch: 'full',
        redirectTo: '/vegas-odds/nba-live-vegas-odds'
      },
      {
        path: 'willie-cauleystein',
        pathMatch: 'full',
        redirectTo: '/nba/player-stats/willie-cauley-stein'
      },
      {
        path: 'vegas-odds/nba-live-odds',
        pathMatch: 'full',
        redirectTo: '/vegas-odds/nba-live-vegas-odds'
      },
      {
        path: '2017',
        pathMatch: 'full',
        redirectTo: ''
      },
      {
        path: 'data-mining/insights/chicago-cubs',
        pathMatch: 'full',
        redirectTo: '/mlb/lineups/chicago-cubs'
      },
      {
        path: 'data-mining/insights/houston-astros',
        pathMatch: 'full',
        redirectTo: '/mlb/lineups/houston-astros'
      },
      {
        path: 'players',
        component: PlayersPageComponent,
        data: {
          url: 'nba',
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
          title: 'NBA Teams',
          league: 'nba'
        },
        pathMatch: 'full'
      },
      {
        path: 'nba-player-stats',
        pathMatch: 'full',
        redirectTo: '/nba/player-stats'
      },
      {
        path: 'nba-player-stats/:year',
        pathMatch: 'full',
        redirectTo: '/nba/player-stats'
      },
      {
        path: 'lineups/:active_year/:team_name/undefined',
        pathMatch: 'full',
        redirectTo: 'lineups/:team_name'
      },
      {
        path: 'lineups/:active_year/:team_name',
        pathMatch: 'full',
        redirectTo: 'lineups/:team_name'
      },
      {
        // path: 'lineups/:team_name',
        matcher: teamUrlMatcherLineups,
        component: TeamLineupComponent,
        resolve: {
          data: IndividualTeamLineupResolver
        },
        data: {
          header: 'Lineup',
          showYear: false
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
        path: 'team-stats/:team_name',
        pathMatch: 'full',
        component: NbaTeamStatsComponent,
        resolve: {
          pageData: NbaTeamStatsResolver
        }
      },
      {
        path: 'depth-charts/:year/:team_name',
        pathMatch: 'full',
        redirectTo: 'depth-charts/:team_name'
      },
      {
        path: 'depth-chart/:team_name',
        pathMatch: 'full',
        redirectTo: 'depth-charts/:team_name'
      },
      {
        path: 'depth-charts/:team_name',
        component: TeamLineupComponent,
        resolve: {
          data: IndividualDepthChartResolver
        },
        data: {
          header: 'Depth Chart'
        },
        children: [
          {
            path: '',
            component: IndividualDepthChartComponent,
            data: {title: 'DYNAMIC'},
          }
        ]
      },
      {
        path: 'depth-charts',
        pathMatch: 'full',
        component: DepthChartsComponent,
      },
      {
        path: 'lineups/:year',
        pathMatch: 'full',
        redirectTo: 'lineups'
      },
      {
        path: 'roster',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },
      {
        path: 'roster/:active_year/:team_name',
        pathMatch: 'full',
        redirectTo: 'roster/:team_name'
      },
      {
        // path: 'roster/:team_name',
        matcher: teamUrlMatcherRoster,
        component: TeamLineupComponent,
        resolve: {
          data: IndividualRosterResolver
        },
        data: {
          header: 'Roster'
        },
        children: [
          {
            path: '',
            component: RosterComponent,
            data: {
              title: 'DYNAMIC'
            },
          }
        ]
      },
      {
        path: 'roster/:year',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },
      {
        path: 'rosters/:year',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },
      {
        path: 'rosters',
        component: RostersHomePageComponent,
        resolve: {
          rosters: RostersHomePageResolver,
        },
        data: {
          league: 'nba',
          title: 'DYNAMIC'
        },
        pathMatch: 'full'
      },
      {
        path: 'news',
        pathMatch: 'full',
        component: NewsHomePageComponent,
        data: {
          title: 'NBA News',
          url: 'nba'
        }
      },
      {
        path: 'news/undefined',
        pathMatch: 'full',
        redirectTo: 'news'
      },
      {
        path: 'news/:team_name',
        pathMatch: 'full',
        component: TeamLineupComponent,
        resolve: {
          data: IndividualTeamNewsResolver
        },
        data: {
          header: 'News'
        },
        children: [
          {
            path: '',
            component: NewsComponent,
            data: {title: 'DYNAMIC'},
          }
        ]
      },
      {
        path: 'news/matchups/:team_names',
        pathMatch: 'full',
        redirectTo: 'news'
      },
      {
        path: 'matchups',
        pathMatch: 'full',
        component: MatchupsGatewayComponent,
        data: {
          title: 'NBA Matchups, NBA Daily Matchups'
        },
      },
      {
        path: 'matchups/nba/matchups/:year/:date/:game_key',
        pathMatch: 'full',
        redirectTo: 'matchups'
      },
      {
        path: 'matchups/:year/:date/:game_key',
        pathMatch: 'full',
        redirectTo: 'matchups'
      },
      {
        path: 'matchups/:team_names',
        pathMatch: 'full',
        component: IndividualMatchupComponent,
        data: {
          page: 'matchupDetails'
        },
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
        path: 'schedule',
        component: ScheduleComponent,
        data: {
          breadcrumb: 'NBA Schedule',
          title: 'NBA Schedule'
        }
      },
      {
        // path: 'schedule/:team_name',
        matcher: teamUrlMatcherSchedule,
        component: TeamLineupComponent,
        resolve: {
          data: TeamScheduleResolver
        },
        data: {
          header: 'Schedule'
        },
        children: [
          {
            path: '',
            component: TeamScheduleComponent,
            data: {title: 'DYNAMIC'},
          }
        ]
      },
      {
        path: 'schedule/:active_year/:team_name',
        pathMatch: 'full',
        redirectTo: 'schedule/:team_name',
      },
      {
        path: 'schedule/:date',
        pathMatch: 'full',
        redirectTo: 'schedule'
      },
      {
        path: 'schedule/:active_year/:team_name/undefined',
        pathMatch: 'full',
        redirectTo: 'schedule/:active_year/:team_name'
      },
      {
        path: 'injuries/matchups/:any',
        pathMatch: 'full',
        redirectTo: 'player-injuries'
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
          url: 'nba',
          title: 'NBA Player Injuries'
        }
      },
      {
        path: 'player-injuries/:team_name',
        pathMatch: 'full',
        component: TeamLineupComponent,
        resolve: {
          data: IndividualTeamLineupResolver
        },
        data: {
          header: 'Injuries'
        },
        children: [
          {
            path: '',
            component: TeamInjuriesComponent
          }
        ]
      },
      {
        path: 'standings',
        component: StandingsPageComponent,
        data: {
          league: 'nba'
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
    HomeComponent,
    NbaComponent,
    MatchupsGatewayComponent,
    MatchupComponent,
    IndividualMatchupComponent,
    MatchupDetailsComponent,
    TeamLineupComponent,
    CurrentTeamLineupComponent,
    RosterComponent,
    NewsComponent,
    MatchupNewsComponent,
    ScheduleComponent,
    TeamScheduleComponent,
    ScheduleContentComponent,
    TeamInjuriesComponent,
    IndividualDepthChartComponent,
    OffensePlayerBoxComponent,
    DepthChartsComponent,
    IframeDepthChartViewComponent,
    NbaTeamStatsComponent,
    NoNbaStatsComponent
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
    DepthChartSingleItemModule,
    nbaRouting
  ],
  providers: [
    TeamLineupService,
    LineupsGatewayService,
    ScheduleService,
   
    // Resolvers
    IndividualRosterResolver,
    NbaTeamStatsService,
    TeamService,
    TeamRankingsService,
    IndTeamStatsService,
    SingleMatchupResolver,
    IndividualTeamLineupResolver,
    IndividualTeamNewsResolver,
    TeamScheduleResolver,
    RostersHomePageResolver,
    MinutesResolver,
    TeamsResolver,
    IndividualDepthChartResolver,
    NbaTeamStatsResolver
  ]
})
export class NbaModule { }


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

export function validateYear(year) {
  return year.length === 4 && parseInt(year, 10).toString().length === 4;
}

export function teamUrlMatcherLineups(url: UrlSegment[]) {
 return teamUrlMatcher('lineups', url);
}
export function teamUrlMatcherRoster(url: UrlSegment[]) {
 return teamUrlMatcher('roster', url);
}
export function teamUrlMatcherSchedule(url: UrlSegment[]) {
 return teamUrlMatcher('schedule', url);
}


