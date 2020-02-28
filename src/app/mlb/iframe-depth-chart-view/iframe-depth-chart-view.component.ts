
import {throwError as observableThrowError, forkJoin as observableForkJoin } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarService } from '../../navbar/navbar.service';
import { CommonService } from '../../shared/services/common.service';
import { RosterService } from '../roster/roster.service';
import { LineupsGatewayService } from '../lineups-gateway/lineups-gateway.service';

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

  readonly nineArr = Array.apply(null, {length: 9}).map(Number.call, Number);

  constructor(
    private navbarService: NavbarService,
    private lineupsGatewayService: LineupsGatewayService,
    private commonService: CommonService
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

  private generateTeamData(mode: 'home' | 'away', lineup) {
    return {
      teamInfo: lineup[mode + '_team']
    }
  }

  private getGatewayData() {
    this.lineupsGatewayService.mlbStartingLineups().pipe(
      catchError(err => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe((lineupsData) => {
        if (lineupsData && lineupsData.data && lineupsData.data.length) {
          this.depthChartsList = [];
          lineupsData.data.forEach(lineup => {
            this.depthChartsList.push(this.generateTeamData('home', lineup), this.generateTeamData('away', lineup));
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
