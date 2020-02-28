import { Component, Input, OnInit } from '@angular/core';
import { inactiveNBAPlayers } from '../../../nba/stats/single-player/redirect-player-list';
import { inactiveMlbPlayers } from '../../../mlb/player-page/player-redirect-list';
import { playersRedirectListToStats } from '../../../nfl/player-page/player-redirect-list';
import * as _ from 'lodash';

@Component({
  selector: 'app-player-link',
  templateUrl: './player-link.component.html',
})
export class PlayerLinkComponent implements OnInit {
  @Input() league: 'nfl' | 'nba' | 'mlb';
  @Input() playerUrl: string;
  @Input() playerName: string;
  @Input() photoUrl: string;

  @Input() additionalText: string;
  @Input() shortName: string;
  @Input() playerClassName = '';
  @Input() generateShortName = true;
  @Input() customContent = false;

  showCustomContentUrl = true;

  constructor(
  ) { }

  ngOnInit() {
    if (this.playerUrl && this.league) {
      if (this.playerUrl.indexOf('/') !== 0) {
        this.playerUrl = '/' + this.playerUrl;
      }
      const urlName = this.playerUrl.split('/').pop();

      switch (this.league) {
        case 'nba': {
          if (this.customContent) {
            return this.showCustomContentUrl = !_.includes(inactiveNBAPlayers, urlName);
          }
          if (_.includes(inactiveNBAPlayers, urlName)) {
            this.playerUrl = null;
          }
          break;
        }
        case 'mlb': {
          if (this.customContent) {
            return this.showCustomContentUrl = !_.includes(inactiveMlbPlayers, urlName);
          }
          if (_.includes(inactiveMlbPlayers, urlName)) {
            this.playerUrl = null;
          }
          break;
        }
        case 'nfl': {
          if (this.customContent) {
            return this.showCustomContentUrl = !_.includes(playersRedirectListToStats, urlName);
          }
          if (_.includes(playersRedirectListToStats, urlName)) {
            this.playerUrl = null;
          }
          break;
        }
      }
    }
  }
}
