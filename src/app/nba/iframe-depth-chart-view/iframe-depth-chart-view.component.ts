
import {throwError as observableThrowError, forkJoin as observableForkJoin } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';

// Services
import { NavbarService } from '../../navbar/navbar.service';
import { LineupsGatewayService } from '../lineups-gateway/lienups.service';
import { CommonService } from '../../shared/services/common.service';
import { RosterService } from '../roster/roster.service';


@Component({
  selector: 'app-iframe-depth-chart-view',
  templateUrl: './iframe-depth-chart-view.component.html',
  styleUrls: ['./iframe-depth-chart-view.component.scss']
})
export class IframeDepthChartViewComponent implements OnInit, OnDestroy {
  loading = true;
  depthChartsList: any[];
  pageHeading: string;
  isDefaultYear = true;

  constructor(
    private navbarService: NavbarService,
    private lineupsGatewayService: LineupsGatewayService,
    private commonService: CommonService,
    private rosterService: RosterService,
  ) {
    this.navbarService.removeNavbar();
  }

  ngOnInit() {
    this.loading = true;
    this.getGatewayData();
    this.commonService.subscribeOnHeight();
  }

  ngOnDestroy() {
    if (this.commonService.isBrowser()) {
      window.removeEventListener('message', this.commonService.heightListener);
    }
    this.navbarService.showNavbar();
  }

  private generateTeamData(mode: 'home' | 'away', lineup, rosterData) {
    return {
      nav: lineup.game_info[mode + '_nav'],
      players: lineup[mode + '_players'],
      primary_hex: rosterData.primary_hex[lineup.game_info[mode + '_nav'].team_name_full]
    }
  }

  private getGatewayData() {
    observableForkJoin([this.lineupsGatewayService.getNbaStartingLineups(), this.rosterService.getRosterRoutes()]).pipe(
      catchError(err => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe(([lineupsData, rosterData]) => {
        if (lineupsData && lineupsData.data && lineupsData.data.length) {
          this.depthChartsList = [];
          lineupsData.data.forEach(lineup => {
            this.depthChartsList.push(this.generateTeamData('home', lineup, rosterData), this.generateTeamData('away', lineup, rosterData));
          });
        }
        this.loading = false;
        if (this.commonService.isBrowser() && this.commonService.openedInIframe()) {
          setTimeout(() => {
            this.commonService.heightListener({data: 'FrameHeight', source: window.parent});
          }, 200);
        }
      });
  }
}
