import { Point } from '../point';
import { Move } from './move';
export class WaitForBall extends Move {
  update(delta: number) {
    this.done = Point.equals(this.gameObject.location, this.gameObject.game.ball.location);
  }

  dispose() { }
}
