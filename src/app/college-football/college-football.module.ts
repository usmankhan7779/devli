import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollegeFootballComponent } from './college-football.component';
import { PlayersPageComponent } from '../shared/components/players-page/players-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataTableModule } from '@pascalhonegger/ng-datatable';
import { HomeComponent } from './home/home.component';
import { RostersHomePageComponent } from '../shared/components/rosters-home-page/rosters-home-page.component';
import { RostersHomePageResolver } from './roster/rosters-home-page.resolver';
import { TeamLineupService } from './team-lineup/team-lineup.service';
import { TeamLineupComponent } from './team-lineup/team-lineup.component';
import { IndividualRosterResolver } from './roster/individual-roster.resolver';
import { RosterComponent } from './roster/roster.component';
import { TeamsPageComponent } from '../shared/components/teams-page/teams-page.component';
import { TeamsResolver } from './teams/teams.resolver';

const collegeFootballRouting: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: CollegeFootballComponent,
    data: {breadcrumb: 'CFB'},
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          breadcrumb: null
        },
        pathMatch: 'full'
      },
      {
        path: 'players',
        component: PlayersPageComponent,
        data: {
          url: 'cfb',
        }
      },
      {
        path: 'alabama-crimson-tide',
        pathMatch: 'full',
        redirectTo: 'roster/alabama-crimson-tide'
      },
      {
        path: 'army-black-knights',
        pathMatch: 'full',
        redirectTo: 'roster/army-black-knights'
      },
      {
        path: 'auburn-tigers',
        pathMatch: 'full',
        redirectTo: 'roster/auburn-tigers'
      },
      {
        path: 'florida-gators',
        pathMatch: 'full',
        redirectTo: 'roster/florida-gators'
      },
      {
        path: 'georgia-bulldogs',
        pathMatch: 'full',
        redirectTo: 'roster/georgia-bulldogs'
      },
      {
        path: 'iowa-state-cyclones',
        pathMatch: 'full',
        redirectTo: 'roster/iowa-state-cyclones'
      },
      {
        path: 'lsu-tigers',
        pathMatch: 'full',
        redirectTo: 'roster/lsu-tigers'
      },
      {
        path: 'michigan-wolverines',
        pathMatch: 'full',
        redirectTo: 'roster/michigan-wolverines'
      },
      {
        path: 'mississippi-state-bulldogs',
        pathMatch: 'full',
        redirectTo: 'roster/mississippi-state-bulldogs'
      },
      {
        path: 'northwestern-wildcats',
        pathMatch: 'full',
        redirectTo: 'roster/northwestern-wildcats'
      },
      {
        path: 'notre-dame-fighting-irish',
        pathMatch: 'full',
        redirectTo: 'roster/notre-dame-fighting-irish'
      },
      {
        path: 'ohio-state-buckeyes',
        pathMatch: 'full',
        redirectTo: 'roster/ohio-state-buckeyes'
      },
      {
        path: 'oklahoma-sooners',
        pathMatch: 'full',
        redirectTo: 'roster/oklahoma-sooners'
      },
      {
        path: 'oregon-ducks',
        pathMatch: 'full',
        redirectTo: 'roster/oregon-ducks'
      },
      {
        path: 'penn-state-nittany-lions',
        pathMatch: 'full',
        redirectTo: 'roster/penn-state-nittany-lions'
      },
      {
        path: 'stanford-cardinals',
        pathMatch: 'full',
        redirectTo: 'roster/stanford-cardinals'
      },
      {
        path: 'syracuse-orange',
        pathMatch: 'full',
        redirectTo: 'roster/syracuse-orange'
      },
      {
        path: 'texas-am-aggies',
        pathMatch: 'full',
        redirectTo: 'roster/texas-am-aggies'
      },
      {
        path: 'texas-longhorns',
        pathMatch: 'full',
        redirectTo: 'roster/texas-longhorns'
      },
      {
        path: 'ucf-knights',
        pathMatch: 'full',
        redirectTo: 'roster/ucf-knights'
      },
      {
        path: 'utah-utes',
        pathMatch: 'full',
        redirectTo: 'roster/utah-utes'
      },
      {
        path: 'washington-huskies',
        pathMatch: 'full',
        redirectTo: 'roster/washington-huskies'
      },
      {
        path: 'washington-state-cougars',
        pathMatch: 'full',
        redirectTo: 'roster/washington-state-cougars'
      },
      {
        path: 'wisconsin-badgers',
        pathMatch: 'full',
        redirectTo: 'roster/wisconsin-badgers'
      },
      {
        path: 'roster',
        pathMatch: 'full',
        redirectTo: 'rosters'
      },
      {
        path: 'roster/miami-%28oh%29-redhawks',
        pathMatch: 'full',
        redirectTo: 'roster/miami-oh-redhawks'
      },
      {
        path: 'roster/:team_name',
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
            component: RosterComponent
          }
        ]
      },
      {
        path: 'rosters',
        component: RostersHomePageComponent,
        resolve: {
          rosters: RostersHomePageResolver,
        },
        data: {
          league: 'college-football'
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
          title: 'CFB Teams',
          league: 'college-football'
        },
        pathMatch: 'full'
      },
    ]
  }
]);


@NgModule({
  declarations: [
    CollegeFootballComponent,
    HomeComponent,
    RosterComponent,
    TeamLineupComponent
  ],
  imports: [
    NgbModule,
    SharedModule,
    NgxPaginationModule,
    DataTableModule,
    collegeFootballRouting
  ],
  providers: [
    RostersHomePageResolver,
    TeamLineupService,
    IndividualRosterResolver,
    TeamsResolver
  ]
})
export class CollegeFootballModule { }
