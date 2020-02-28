import { Player } from '../player';
import { Move } from './move';

export class LeaveField extends Move {

  private _speed = 0.1;
  private _distance: number;
  gameObject: Player;

  get speed() { return this._speed; }
  get destination() { return this.gameObject.benchLocation; }
  get distance() { return this._distance; }

  constructor() {
    super();
  }

  public update(delta: number) {
    const deltaX = this.gameObject.benchLocation.x - this.gameObject.location.x;
    const deltaY = this.gameObject.benchLocation.y - this.gameObject.location.y;
    this._distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const ratio = delta * this._speed * this.gameObject.game.speed / this._distance;

    if (ratio >= 1) {
      this.gameObject.location.x = this.gameObject.benchLocation.x;
      this.gameObject.location.y = this.gameObject.benchLocation.y;
      this.done = true;
    } else {
      this.gameObject.location.x += deltaX * ratio;
      this.gameObject.location.y += deltaY * ratio;
    }
  }

  dispose() { }
}
