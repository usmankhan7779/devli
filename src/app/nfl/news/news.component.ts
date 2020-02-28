
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { NewsService } from './news.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../../shared/services/title.service';
import { NflService } from '../nfl.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  isCollapsed: boolean;
  teamNameParam: string;
  pageHeading: string;
  activeYear: number;
  newsData: any;
  newsItems: any;
  isDefaultSeason: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private nflService: NflService,
    private titleService: TitleService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamNameParam = params['team_name'];
      const season = this.newsService.getPreSelectedTeamSeason();
      this.newsService.removePreSelectedTeamSeason();
      this.newsService.getTeamNews(this.teamNameParam, season).pipe(
        catchError(err => {
          return observableThrowError(err);
        }))
        .subscribe(newsRes => {
          this.activeYear = newsRes.nav.matchup_season;
          this.isDefaultSeason = (this.activeYear ? this.nflService.checkIfDefaultSeason(this.activeYear, [], true) : true);
          if (newsRes.page_title) {
            this.titleService.setTitle(newsRes.page_title);
          } else {
            this.titleService.setTitle(`${newsRes.nav.team_name_full} News`);
          }
          if (newsRes.heading) {
            this.pageHeading = newsRes.heading;
          } else {
            this.pageHeading = newsRes.nav.team_name_full + ' News';
          }
          this.breadcrumbService.changeBreadcrumbs([
            {label: 'NFL', url: '/nfl'},
            {label: 'Teams', url: '/nfl/teams'},
            {label: 'News', url: '/nfl/news'},
            {label: this.pageHeading, url: `/nfl/news/${this.teamNameParam}`}
          ]);
          this.newsData = newsRes;
          this.newsItems = this.newsData.news.slice(0);
        });
    });
  }

  filterByName(filterVal) {
    return this.newsData.news.filter((item) => {
      return item.title.toLowerCase().indexOf(filterVal.toLowerCase()) !== -1;
    });
  }

  updateNews(filteredNews) {
    this.newsItems = filteredNews;
  }

}
