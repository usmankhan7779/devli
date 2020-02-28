
import {throwError as observableThrowError, forkJoin as observableForkJoin,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepthChartService } from '../depth-charts/depth-chart.service';
import { RosterService } from '../roster/roster.service';
import { NavbarService } from '../../navbar/navbar.service';


@Component({
  selector: 'app-iframe-depth-chart-view',
  templateUrl: './iframe-depth-chart-view.component.html',
  styleUrls: ['./iframe-depth-chart-view.component.scss']
})
export class IframeDepthChartViewComponent implements OnInit, OnDestroy {
  loading = true;
  depthChartsList: any[];

  constructor(
    private route: ActivatedRoute,
    private depthChartService: DepthChartService,
    private rosterService: RosterService,
    private navbarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navbarService.removeNavbar();
    this.loading = true;
    observableForkJoin([this.rosterService.getRosterRoutes(), this.depthChartService.getDepthCharts()]).pipe(
      catchError(err => {
        this.loading = false;
        return observableThrowError(err);
      }))
      .subscribe(([rosterData, {depth_charts}]) => {
        if (depth_charts && depth_charts.length) {
          this.depthChartsList = this.depthChartService.createAlternativeStructure(depth_charts, rosterData);
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.navbarService.showNavbar();
  }
}
