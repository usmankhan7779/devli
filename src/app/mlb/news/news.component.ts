import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { NewsService } from './news.service';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';
import { MlbService } from '../mlb.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  pageHeading: string;
  teamNameParam: string;
  activeYear: number;
  newsData: any;
  newsItems: any;
  isDefaultSeason: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private mlbService: MlbService,
    private titleService: TitleService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // Set Router Param Dependent Values
      this.teamNameParam = params['team_name'];
      this.activeYear = this.newsService.getPreSelectedTeamSeason();
      this.newsService.removePreSelectedTeamSeason();
      const newsRes = this.route.snapshot.data['data'];
      console.log(newsRes);
      this.isDefaultSeason = (this.activeYear ? this.mlbService.checkIfDefaultSeason(this.activeYear, [], true) : true);
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
        {label: 'MLB', url: '/mlb'},
        {label: 'Teams', url: '/mlb/teams'},
        {label: 'News', url: `/mlb/news`},
        {label: this.pageHeading, url: `/mlb/news/${this.teamNameParam}`},
      ]);
      this.newsData = newsRes;
      this.newsItems = this.newsData.news.slice(0);
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
