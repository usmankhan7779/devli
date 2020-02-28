import { Player } from '../player';
import { Move } from './move';
import howler from 'howler';

export class TacklePlayer extends Move {

  private tackleSound: Howl;

  constructor(
    private player: Player
  ) {
    super();

    this.tackleSound = new howler.Howl({
      src: ['../assets/audio/tackle.wav'],
      autoplay: false,
      loop: false
    });
  }

  mute(muted: boolean) {
    this.tackleSound.mute(muted);
  }

  public update(delta: number) {
    const destination = (this.player.move && this.player.move.destination) || this.player.location;

    const deltaX = destination.x - this.gameObject.location.x;
    const deltaY = destination.y - this.gameObject.location.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let speed = 0.015;
    if (this.player.move && this.player.move.distance && this.player.move.speed) {
      speed = (distance * this.player.move.speed / this.player.move.distance) || speed;
    }
    const ratio = delta * speed * this.gameObject.game.speed / distance;

    if (ratio >= 1) {
      this.gameObject.location.x = destination.x;
      this.gameObject.location.y = destination.y;
      if (this.player.outOfMoves) {
        this.gameObject.location.x = destination.x + 0.5;
        this.gameObject.location.y = destination.y + 0.5;
        this.player.tackled = true;
        (<Player>this.gameObject).tackled = true;
        this.done = true;
        this.tackleSound.play();
      }
    } else {
      this.gameObject.location.x += deltaX * ratio;
      this.gameObject.location.y += deltaY * ratio;
    }
  }

  dispose() {
    this.tackleSound.stop();
  }
}
