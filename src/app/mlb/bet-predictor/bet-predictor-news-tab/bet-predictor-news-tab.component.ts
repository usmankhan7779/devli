import { Component, Input, OnInit } from '@angular/core';
import { NewsService } from '../../news/news.service';

@Component({
  selector: 'app-bet-predictor-news-tab',
  templateUrl: './bet-predictor-news-tab.component.html',
  styleUrls: ['./bet-predictor-news-tab.component.scss']
})
export class BetPredictorNewsTabComponent implements OnInit {
  @Input() set matchup(matchup) {
    this.newsData = undefined;
    const teamUrl = `${matchup.header.details.away_short.toLowerCase()}-${matchup.header.details.home_short.toLowerCase()}`;
    this.newsService.getMatchupNews(teamUrl)
      .subscribe(newsRes => {
        this.newsData = newsRes;
      })
  }
  newsData;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
  }

}
