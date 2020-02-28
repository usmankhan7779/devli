import { Game } from '../game';
import { GameObject } from '../gameObject';
import { Point } from '../point';
import { Move } from './move';

export class MoveToLocation extends Move {

  private _distance: number;

  get speed() { return this._speed; }
  get destination() { return this.location; }
  get distance() { return this._distance; }

  constructor(
    private location: Point,
    private _speed = 0.015
  ) {
    super();
  }

  public update(delta: number) {
    const deltaX = this.location.x - this.gameObject.location.x;
    const deltaY = this.location.y - this.gameObject.location.y;
    this._distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const ratio = delta * this.speed * this.gameObject.game.speed / this._distance;

    if (ratio >= 1) {
      this.gameObject.location.x = this.location.x;
      this.gameObject.location.y = this.location.y;
      this.done = true;
    } else {
      this.gameObject.location.x += deltaX * ratio;
      this.gameObject.location.y += deltaY * ratio;
    }
  }

  dispose() { }
}
