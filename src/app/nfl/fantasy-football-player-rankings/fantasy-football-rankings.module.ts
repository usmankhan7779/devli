import { RouterModule, UrlSegment } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import * as _ from 'lodash';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  FantasyFootballPlayerRankingsService,
  fantasyFootballPlayerRankingsTypes
} from './fantasy-football-player-rankings.service';
import { FantasyFootballRankingsModuleComponent } from './fantasy-football-rankings-module.component';
import { FantasyFootballPlayerRankingsComponent } from './fantasy-football-player-rankings.component';
import { FantasyFootballPlayerRankingsResolver } from './fantasy-football-player-rankings.resolver';

export function fantasyFootballPlayerRankingsUrlMatcher(url: UrlSegment[]) {
  if (url.length === 0) {
    return {
      consumed: url,
    };
  }
  if (url.length && _.includes(fantasyFootballPlayerRankingsTypes, url[0].path)) {
    return {
      consumed: url,
      posParams: {
        type: url[0]
      }
    };
  }
  return null;
}

const Routing: ModuleWithProviders = RouterModule.forChild([
  {
    path: '',
    component: FantasyFootballRankingsModuleComponent,
    data: {breadcrumb: null},
    children: [
      {
        matcher: fantasyFootballPlayerRankingsUrlMatcher,
        component: FantasyFootballPlayerRankingsComponent,
        resolve: {
          pageData: FantasyFootballPlayerRankingsResolver
        }
      },
    ]
  }
]);

@NgModule({
  imports: [
    NgbModule,
    NgxPaginationModule,
    SharedModule,
    Routing
  ],
  declarations: [
    FantasyFootballRankingsModuleComponent,
    FantasyFootballPlayerRankingsComponent
  ],
  providers: [
    FantasyFootballPlayerRankingsResolver,
    FantasyFootballPlayerRankingsService
  ]
})
export class FantasyFootballRankingsModule { }
