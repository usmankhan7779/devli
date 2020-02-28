import { Move } from './move';
export class FollowBallUntilMove extends Move {

  constructor(private targetMove: Move) {
    super();
  }

  public update(delta: number) {
    this.done = this.targetMove.started;

    const deltaX = this.gameObject.game.ball.location.x - this.gameObject.location.x;
    const deltaY = this.gameObject.game.ball.location.y - this.gameObject.location.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const ratio = delta * 0.015 * this.gameObject.game.speed / distance;

    if (ratio >= 1) {
      this.gameObject.location.x = this.gameObject.game.ball.location.x;
      this.gameObject.location.y = this.gameObject.game.ball.location.y;
    } else {
      this.gameObject.location.x += deltaX * ratio;
      this.gameObject.location.y += deltaY * ratio;
    }
  }

  dispose() { }
}
