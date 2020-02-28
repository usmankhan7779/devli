import { Game } from '../lib/game';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as howler from 'howler';
export declare let require: any;

export enum _DisplayMode {
  WatchGame,
  Highlights,
  Recap
}
/* angular cli fix https://github.com/angular/angular-cli/issues/8536 */
export const DisplayMode = {
  '0': 'WatchGame',
  '1': 'Highlights',
  '2': 'Recap',
  'Highlights': 1,
  'Recap': 2,
  'WatchGame': 0,
};

export enum _RecapMode {
  BoxScore,
  PlayByPlay,
  ScoringSummary,
  GameReview
}
/* angular cli fix https://github.com/angular/angular-cli/issues/8536 */
export const RecapMode = {
  '0': 'BoxScore',
  '1': 'PlayByPlay',
  '2': 'ScoringSummary',
  '3': 'GameReview',
  'BoxScore': 0,
  'PlayByPlay': 1,
  'ScoringSummary': 2,
  'GameReview': 3,
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  DisplayMode = DisplayMode;

  RecapMode = RecapMode;

  @Input() game: Game;

  @Input() highlights: Game;

  private _displayMode: _DisplayMode;

  get displayMode() { return this._displayMode; }

  @Output() displayModeChange = new EventEmitter();

  @Input()
  set displayMode(value) {
    if (this._displayMode === value) {
      return;
    }

    if (this._displayMode === DisplayMode.WatchGame) {
      this.game.pause();
    } else if (this._displayMode === DisplayMode.Highlights && this.highlights) {
      this.highlights.pause();
    }
    this._displayMode = value;
    this.displayModeChange.emit(this._displayMode);
  }

  private _recapMode = RecapMode.BoxScore;

  get recapMode() { return this._recapMode; }
  @Output() recapModeChange = new EventEmitter();
  @Input()
  set recapMode(value) {
    if (this._recapMode === value) {
      return;
    }
    this._recapMode = value;
    this.recapModeChange.emit(this._recapMode);
  }

  autoRun = false;

  muted = false;

  debugControls = location.hostname === 'localhost';

  icons = {
    back: '/assets/icons/back.svg',
    play: '/assets/icons/play.svg',
    speed2x: '/assets/icons/speed2x.svg',
    speed3x: '/assets/icons/speed3x.svg',
    sound: '/assets/icons/sound.svg',
    mute: '/assets/icons/mute.svg',
    pause: '/assets/icons/pause.svg'
  };

  constructor() { }

  ngOnInit() {
  }

  back(game: Game) {
    game.rewind();
  }

  start(game: Game) {
    game.start();
  }

  pause(game: Game) {
    game.pause();
  }

  nextPlay(game: Game) {
    game.playIndex++;
    game.startPlay(true);
  }

  setPlayIndex(game: Game, index: string) {
    game.playIndex = parseInt(index, 10);
  }

  toggleSpeed(game: Game, speed: number) {
    if (game.speed === speed) {
      game.speed = 1;
    } else {
      game.speed = speed;
    }
  }

  runPlay(game: Game, playNumber: string) {
    game.startPlay(true);
  }

  toggleMute() {
    this.muted = !this.muted;
    howler.Howler.mute(this.muted);
  }

  description() {
    if (this.displayMode === DisplayMode.WatchGame) {
      return this.game.play ? this.game.play.description :
        (this.game.done ? 'This game is now over' : 'Click the play button to start the game');
    } else if (this.highlights && this.displayMode === DisplayMode.Highlights) {
      return this.highlights.play ? this.highlights.play.description :
        (this.highlights.done ? 'The highlights are over' : 'Click the play button to start the highlights');
    }
  }
}
