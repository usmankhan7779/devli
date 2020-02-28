import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../lib/game';

@Component({
  selector: 'app-game-review',
  templateUrl: './game-review.component.html',
  styleUrls: ['./game-review.component.scss']
})
export class GameReviewComponent implements OnInit {
  private _game: Game;

  @Input()
  set game(value: Game) {
    this._game = value;
  }

  get game() {
    return this._game;
  }

  constructor() { }

  ngOnInit() {
  }

}
