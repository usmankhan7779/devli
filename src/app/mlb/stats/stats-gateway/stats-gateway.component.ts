import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumb/breadcrumb.service';
import { SpinnerService } from '../../../shared/components/spinner/spinner.service';
import { StatsService } from '../stats.service';
import { DropdownService } from '../../../shared/components/dropdown/dropdown.service';
import { MlbService } from '../../mlb.service';
import { TitleService } from '../../../shared/services/title.service';

@Component({
  selector: 'app-stats-gateway',
  templateUrl: './stats-gateway.component.html',
  styleUrls: ['./stats-gateway.component.scss']
})
export class StatsGatewayComponent implements OnInit, OnDestroy {
  ddData;
  data;
  pageTitle;
  dropdownCollapsed;
  params: {
    year: string,
    statsLeague?: string
  };

  constructor(
    private title: TitleService,
    private breadcrumbService: BreadcrumbService,
    private spinnerService: SpinnerService,
    private statsService: StatsService,
    private dropdownService: DropdownService,
    private mlbService: MlbService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.data = this.route.snapshot.data['leadersData'];
      this.params = {
        year: params.year || this.mlbService.getDefaultSeason(this.data.seasons_dropdown),
        statsLeague: params.statsLeague,
      };
      this.spinnerService.hideSpinner();
      this.ddData = this.statsService.getDddObj('player-stats', this.params.statsLeague, [], params.year);
      this.ddData.seasons = this.dropdownService.prepareSeasons(
         this.data.seasons_dropdown.map(season => {
          return {
            ...season,
            name: season.year
          }
        }),
        this.generateUrlForSeasonsDd.bind(this, this.data.seasons_dropdown, this.params.statsLeague),
        this.params.year
      );
      this.pageTitle = this.data.heading;
      console.log('data', this.data);


      const breadcrumbs = [
        {
          label: 'MLB',
          url: '/mlb'
        },
        {
          label: 'Players',
          url: '/mlb/players'
        },
        {
          label: this.pageTitle,
          url: './'
        }
      ];

      this.breadcrumbService.changeBreadcrumbs(breadcrumbs);

      this.title.setTitle(this.data.page_title);
    });
  }

  ngOnDestroy() {
    this.spinnerService.hideSpinner();
  }

  onViewMoreClick(data) {
    this.spinnerService.showSpinner();
    this.statsService.setSortBy(data.sort_stat);
    this.router.navigate([data.stat_url]);
  }

  onLinkDdClick(item) {
    if (item.url === this.router.url) {
      return;
    }
    this.spinnerService.showSpinner();
  }

  private generateUrlForSeasonsDd(seasons, league, season) {
    // tslint:disable-next-line:max-line-length
    return `/mlb/player-stats${this.mlbService.checkIfDefaultSeason(season.year, seasons) ? '' : '/' + season.year}${league ? '/' + league  : ''}`;
  }
}
