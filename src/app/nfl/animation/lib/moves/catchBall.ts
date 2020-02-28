import { Move } from './move';
export class CatchBall extends Move {
  update(delta: number) {
    const ball = this.gameObject.game.ball;
    const destination = (ball.move && ball.move.destination) || ball.location;

    const deltaX = destination.x - this.gameObject.location.x;
    const deltaY = destination.y - this.gameObject.location.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let speed = 0.015;
    if (ball.move && ball.move.distance && ball.move.speed) {
      speed = distance * ball.move.speed / ball.move.distance;
    }
    const ratio = delta * speed * this.gameObject.game.speed / distance;

    if (ratio >= 1) {
      this.gameObject.location.x = destination.x;
      this.gameObject.location.y = destination.y;
      if (ball.outOfMoves) {
        this.done = true;
      }
    } else {
      this.gameObject.location.x += deltaX * ratio;
      this.gameObject.location.y += deltaY * ratio;
    }
  }

  dispose() { }
}
