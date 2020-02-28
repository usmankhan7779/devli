import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-fantasy-football-projections',
  templateUrl: './fantasy-football-projections.component.html',
})
export class FantasyFootballProjectionsComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.breadcrumbService.changeBreadcrumbs([
      {
        url: '/fantasy-football-projections',
        label: 'Fantasy Football Projections'
      }
    ])
  }

}
