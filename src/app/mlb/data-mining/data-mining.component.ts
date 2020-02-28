import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-data-mining',
  templateUrl: './data-mining.component.html',
  styleUrls: ['./data-mining.component.scss']
})
export class DataMiningComponent implements OnInit {
  // Initialize Subscription to Route
  private routeSubscription: Subscription;
  teamNameParam: string;
  teamLineup: any;
  activeYear: number;
  dataMiningData: any;
  customBreadcrumbs = [];
  dataMiningList = [
    {
      info: [
        'One',
        'Two',
        'Three',
        'Four'
      ]
    },
    {
      info: [
        'One',
        'Two',
        'Three',
        'Four'
      ]
    },
    {
      info: [
        'One',
        'Two',
        'Three',
        'Four'
      ]
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    // Make Subscription to the Active Route
    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      // Set Router Param Dependent Values
      this.teamNameParam = params['team_name'];
      this.activeYear = params['active_year'];
      // Initialize Custom Breadcrumbs
      const teamNameBC = {
        label: this.teamNameParam.split('-').join(' '),
        url: '/mlb/lineups/' + this.activeYear + '/' + this.teamNameParam
      };
      const activeYearBC = {
        label: this.activeYear,
        url: `/mlb/lineups/${this.activeYear}/${this.teamNameParam}`
      };
      // Push Year, Then Team Name
      this.customBreadcrumbs.push(teamNameBC);
      this.customBreadcrumbs.push(activeYearBC);
      this.breadcrumbService.changeBreadcrumbs(this.customBreadcrumbs);
    });
  }

  ngOnInit() {
  }

}
