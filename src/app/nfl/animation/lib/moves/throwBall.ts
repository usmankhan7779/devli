import { Player } from '../player';
import { MoveToLocation } from './moveToLocation';
import { Point } from '../point';
import { Move } from './move';

export class ThrowBall extends Move {

  private prevDiff = Number.MAX_SAFE_INTEGER;

  constructor(
    private target: Player,
    private passDestination: Point
  ) {
    super();
  }

  public update(delta: number) {
    // Distance between this move's object and the ball's destination
    const ownDist = Point.distance(this.passDestination, this.gameObject.location);

    let diff: number;

    if (this.target.move) {
      // Distance between the pass target and their destination
      const targetDist = Point.distance(this.target.move.destination, this.target.location);
      diff = Math.abs(ownDist / 0.03 - targetDist / this.target.move.speed);
    }

    if (!this.target.move || diff >= this.prevDiff) {
      this.gameObject.game.ball.addMoves(new MoveToLocation(this.passDestination, 0.03));
      this.done = true;
    } else {
      this.prevDiff = diff;
    }
  }

  dispose() { }
}
