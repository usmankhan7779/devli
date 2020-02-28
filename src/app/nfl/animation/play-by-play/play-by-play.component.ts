import { Game } from '../lib/game';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

export interface PbpPlay {
  timestamp: string;
  description: string;
  yardline: number;
  seconds: number;
}

export interface PbpPhase {
  color: string;
  header: string;
  footer: string;
  team: string;
  score: string;
  plays: PbpPlay[];
}

export interface PbpQuarter {
  phases: PbpPhase[];
}

export interface PbpInfo {
  quarters: PbpQuarter[];
}


@Component({
  selector: 'app-play-by-play',
  templateUrl: './play-by-play.component.html',
  styleUrls: ['./play-by-play.component.scss']
})
export class PlayByPlayComponent implements OnInit {

  private _game: Game;

  @Input()
  set game(value: Game) {
    this._game = value;
    this.buildInfo();
  }

  get game() {
    return this._game;
  }

  info: PbpInfo;
  selectedQuarter = 0;

  constructor() { }

  ngOnInit() {
  }

  private buildInfo() {
    const info: PbpInfo = {
      quarters: []
    };
    let quarter: PbpQuarter;
    let phase: PbpPhase;
    this._game.plays.forEach(play => {
      if (play.quarter > info.quarters.length) {
        quarter = {
          phases: []
        };
        info.quarters.push(quarter);
      }

      if (!phase || phase.team !== play.offenseTeam) {
        if (phase) {
          // TODO: somehow get the right number of yards gained
          // const yards = Math.abs(phase.plays[phase.plays.length - 1].yardline - phase.plays[0].yardline);
          const seconds = Math.abs(play.seconds - phase.plays[0].seconds);
          const time = `${Math.floor(seconds / 60)}:${_.padStart((seconds % 60).toString(), 2, '0')}`;
          phase.footer = `${phase.team} DRIVE TOTALS: ${phase.plays.length} Plays, ${time} TOP`; // ${yards} Yards,
        }

        phase = {
          team: play.offenseTeam,
          header: `${this._game.fullTeamName(play.offenseTeam)} - ${play.time}`,
          // tslint:disable-next-line:max-line-length
          score: `${this._game.homeTeam} ${play.startScore[this._game.homeTeam]} - ${this._game.awayTeam} ${play.startScore[this._game.awayTeam]}`,
          footer: '',
          color: this._game.colors[play.offenseTeam],
          plays: []
        };
        quarter.phases.push(phase);
      }

      phase.plays.push({
        timestamp: `${play.data.down}-${Math.round(play.data.yards_to_go)}, ${play.friendlyYardline}`,
        description: `(${play.time}) ${play.finalDescription}`,
        yardline: play.yardLine,
        seconds: play.seconds
      });
    });
    this.info = info;
  }
}
