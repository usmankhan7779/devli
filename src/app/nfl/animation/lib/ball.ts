import { Game } from './game';
import { GameObject } from './gameObject';
import { ImageLoader } from './imageLoader';
import { Move } from './moves/move';
export declare let require: any;

export class Ball extends GameObject {
  private static ballImage: HTMLImageElement;
  private totalDistance: number;
  private trackedMove: Move;
  private angle: number;

  static async loadImages() {
    this.ballImage = await ImageLoader.load(require('assets/ball.png'));
  }

  constructor(public game: Game) {
    super();
    this.location = { x: -10, y: -10 };
  }

  render(context: CanvasRenderingContext2D) {
    if (!Ball.ballImage) {
      return;
    }

    let zoom = 1;
    if (this.move && this.move.destination) {
      if (!this.totalDistance || this.trackedMove !== this.move) {
        this.trackedMove = this.move;
        const dx = this.move.destination.x - this.location.x;
        const dy = this.move.destination.y - this.location.y;
        this.angle = Math.atan(dx / dy);
        this.totalDistance = Math.sqrt(dx * dx + dy * dy);
      } else {
        const dx = this.move.destination.x - this.location.x;
        const dy = this.move.destination.y - this.location.y;
        const toGo = Math.sqrt(dx * dx + dy * dy);

        zoom += Math.sin((Math.PI * toGo) / this.totalDistance) * (this.totalDistance / 50);
        if (toGo <= 0) {
          this.totalDistance = 0;
        }
      }
    }
    const size = this.game.spriteSize * zoom;

    const pos = this.game.yardsToPixels(this.location);
    // tslint:disable-next-line:max-line-length
    context.save();
    context.translate(pos.x, pos.y);
    context.rotate((Math.PI * -0.25) - this.angle);
    context.drawImage(Ball.ballImage, - this.game.spriteSize / 2, - this.game.spriteSize / 2, size, size);
    context.restore();
  }
}
