import { Point } from '../point';
import { MoveToLocation } from './moveToLocation';
import howler from 'howler';

export class TakeBallToLocation extends MoveToLocation {

  private cheers: Howl;

  constructor(location: Point, private touchDown: boolean) {
    super(location);

    this.cheers = new howler.Howl({
      src: ['../assets/audio/crowd_cheer.wav'],
      autoplay: false,
      loop: false
    });
  }

  mute(muted: boolean) {
    this.cheers.mute(muted);
  }

  public update(delta: number) {
    if (this.touchDown && !this.cheers.playing()) {
      this.cheers.play();
      this.cheers.seek(3);
    }
    super.update(delta);
    this.gameObject.game.ball.location = Point.clone(this.gameObject.location);
  }

  dispose() {
    this.cheers.stop();
  }
}
