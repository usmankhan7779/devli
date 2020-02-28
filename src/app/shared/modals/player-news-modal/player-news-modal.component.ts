import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { PlayerNewsService } from './player-news.service';
import { Observable } from 'rxjs';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-player-news-modal',
  templateUrl: './player-news-modal.component.html',
  styleUrls: ['./player-news-modal.component.scss']
})
export class PlayerNewsModalComponent implements OnInit {
  @Input() data;
  news: any[];
  activeDDs = {
    player: null
  };

  constructor(
    public activeModal: NgbActiveModal,
    private playerNewsService: PlayerNewsService,
    private location: PlatformLocation
  ) {
    location.onPopState(() => {
      // ensure that modal is opened
      if (this.activeModal !== undefined) {
      this.activeModal.close();
      }
    });
  }

  ngOnInit() {
    this.selectPlayer(this.data.selectedPlayerId);
  }

  selectPlayer(id: number) {
    this.activeDDs.player = _.find(this.data.players, {player_id: id});
    let newsRequest: Observable<any>;
    switch (this.data.league) {
      case 'mlb': {
        newsRequest = this.playerNewsService.getMLBPlayerNews(id);
        break;
      }
      case 'nfl': {
        newsRequest = this.playerNewsService.getNFLPlayerNews(id);
        break;
      }
      case 'nba': {
        newsRequest = this.playerNewsService.getNBAPlayerNews(id);
        break;
      }
    }
    if (newsRequest) {
      this.news = null;
      newsRequest.subscribe(res => {
        this.news = res.news;
      });
    }
  }

}
