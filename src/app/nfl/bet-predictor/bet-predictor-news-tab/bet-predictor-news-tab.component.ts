import { Component, Input, OnInit } from '@angular/core';
import { NewsService } from '../../news/news.service';

@Component({
  selector: 'app-bet-predictor-news-tab',
  templateUrl: './bet-predictor-news-tab.component.html',
  styleUrls: ['./bet-predictor-news-tab.component.css']
})
export class BetPredictorNewsTabComponent implements OnInit {
  @Input() set matchup(matchup) {
    this.newsData = undefined;
    const teamUrl = `${matchup.game_info.away_team_key.toLowerCase()}-${matchup.game_info.home_team_key.toLowerCase()}`;
    this.newsService.getNflMatchupNews(teamUrl)
      .subscribe(newsRes => {
        this.newsData = newsRes;
      })
  }
  newsData;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
  }

}
