import { MoveToLocation } from './moveToLocation';
import { Game } from '../game';
import { Player } from '../player';
import { Point } from '../point';
import { Move } from './move';
import howler from 'howler';

const kickSounds = [
  '../assets/audio/Football Kick.wav',
  '../assets/audio/Football Kick 1.wav',
  '../assets/audio/Football Kick 2.wav',
  '../assets/audio/Football Kick 3.wav',
  '../assets/audio/Football Kick 4.wav',
  '../assets/audio/Football Kick 5.wav',
  '../assets/audio/Football Kick 6.wav',
  '../assets/audio/Football Kick 7.wav'
];

export class Kick extends Move {

  private sound: Howl;

  constructor(
    private _destination: Point
  ) {
    super();
    this.sound = new howler.Howl({
      src: [kickSounds[Math.floor(Math.random() * kickSounds.length)]],
      autoplay: false,
      loop: false
    });
  }

  mute(muted: boolean) {
    this.sound.mute(muted);
  }

  public update(delta: number) {
    this.sound.play();
    this.gameObject.game.ball.addMoves(new MoveToLocation(this._destination, 0.03));
    this.done = true;
  }

  dispose() {
    this.sound.stop();
  }
}
