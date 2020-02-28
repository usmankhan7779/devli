import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '../../shared/components/breadcrumb/breadcrumb.service';
import { TitleService } from '../../shared/services/title.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  teamNameParam;
  newsData: any;
  newsItems: any;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private titleService: TitleService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teamNameParam = params['team_name'];
      console.log('getNews', this.route.snapshot.data['data']);
      this.newsData = this.route.snapshot.data['data'];
      this.newsItems = this.newsData.news.slice(0);
      if (this.newsData.page_title) {
        this.titleService.setTitle(this.newsData.page_title);
      } else {
        this.titleService.setTitle(`${this.newsData.nav.team_name_full} News`);
      }
      this.breadcrumbService.changeBreadcrumbs([
        {label: 'NBA', url: '/nba'},
        {label: 'Teams', url: '/nba/teams'},
        {label: 'News', url: '/nba/news'},
        {label: this.newsData.heading || this.newsData.nav.team_name_full, url: `/nba/news/${this.teamNameParam}`}
      ]);
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
