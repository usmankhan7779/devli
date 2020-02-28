
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';

export declare let require: any;
import * as _ from 'lodash';
import { GameDataService } from '../game-data.service';
// import { setTimeout } from 'timers';
import { DisplayMode, _DisplayMode, RecapMode } from '../header/header.component';
import { FireworksComponent } from '../fireworks/fireworks.component';
import { Game } from '../lib/game';
import { FieldComponent } from '../field/field.component';
import { GameData } from '../lib/data/gameData';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input, OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { SimulatorService } from '../../simulator/simulator.service';

@Component({
  selector: 'app-football-game',
  templateUrl: './football-game.component.html',
  styleUrls: ['./football-game.component.scss']
})
export class FootballGameComponent implements OnInit, OnDestroy {
  isIframe: boolean;
  /**
   * URL of the background image to display behind the field, in CSS form
   */
  backgroundImage = `url(${require('assets/bg.jpg')})`;

  DisplayMode = DisplayMode;
  RecapMode = RecapMode;

  _mainField: FieldComponent;
  @ViewChild('mainField', {static: false}) set mainField(value: FieldComponent) { this._mainField = value; }

  _highlightsField: FieldComponent;
  @ViewChild('highlightsField', {static: false}) set highlightsField(value: FieldComponent) { this._highlightsField = value; }

  _fireworks: FireworksComponent;
  @ViewChild(FireworksComponent, {static: false}) set fireworks(value: FireworksComponent) { this._fireworks = value; }

  gameData: GameData;

  game: Game;
  highlights: Game;
  displayMode = DisplayMode.WatchGame;
  recapMode = RecapMode.BoxScore;

  @Output() onClose = new EventEmitter();
  @Input() gameId: string;

  private initialized = false;

  constructor(
    private dataService: GameDataService,
    private commonService: CommonService,
    private router: Router,
    private simulatorService: SimulatorService
  ) {
  }

  ngOnInit() {
    this.isIframe = this.commonService.openedInIframe();
    Howler.volume(0.3);

    this.dataService.get(this.gameId).pipe(
      catchError((err) => {
        this.commonService.showNotification('Sorry game not found', 'Error', 'Close');
        this.onClose.emit();
        return observableThrowError(err);
      }))
      .subscribe((data: GameData) => {

      const pos = _.mapValues(
        _.groupBy(data.players, p => p.team),
        v => _.mapValues(_.groupBy(v, p => p.position), gv => gv.length)
      );

      this.gameData = data;
      window.setTimeout(() => {
        this.game = new Game(this.gameData, this._mainField.canvas, false);
        this.game.touchdown = (show: boolean) => {
          if (show) {
            this._fireworks.start();
            this._mainField.touchdownColor = this.game.colors[this.game.play.touchdownTeam];
          }
          this._mainField.touchdown = show;
        };
        this.game.init();
      });
    });
  }

  ngOnDestroy() {
    if (this.game) {
      this.game.dispose();
    }
    if (this.highlights) {
      this.highlights.dispose();
    }
  }

  displayModeChanged(mode: _DisplayMode) {
    this.displayMode = mode;
    setTimeout(() => {
      if (this.displayMode === DisplayMode.Highlights) {
        this.game.mute(true);
        if (!this.highlights) {
          this.highlights = new Game(this.gameData, this._highlightsField.canvas, true);
          this.highlights.touchdown = (show: boolean) => {
            if (show) {
              this._fireworks.start();
              this._highlightsField.touchdownColor = this.highlights.colors[this.highlights.play.touchdownTeam];
            }
            this._highlightsField.touchdown = show;
          };
          this.highlights.init();
        } else {
          this.highlights.resize();
          this.highlights.mute(false);
        }
      } else if (this.displayMode === DisplayMode.WatchGame) {
        this.game.resize();
        this.game.mute(false);
        if (this.highlights) {
          this.highlights.mute(true);
        }
      } else {
        this.game.mute(true);
        if (this.highlights) {
          this.highlights.mute(true);
        }
      }
    }, 0);
  }

  onDdChange(mode) {
    const game: any = this.game.data.game;
    this.simulatorService.onTeamPreselect({
      away: game.away_team,
      home: game.home_team,
      away_season: game.away_team_id_season,
      home_season: game.home_team_id_season
    });
    this.simulatorService.onViewPreselect(mode);
    this.router.navigate(['/nfl/simulator'])
  }
}
