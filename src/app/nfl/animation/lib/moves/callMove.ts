import { Move } from './move';
import howler from 'howler';

const callSounds = [
  '../assets/audio/Call_1.wav',
  '../assets/audio/Call_2.wav',
  '../assets/audio/Call_3.wav',
  '../assets/audio/Call_4.wav',
  '../assets/audio/Call_5.wav',
  '../assets/audio/Call_6.wav',
  '../assets/audio/Call_7.wav',
  '../assets/audio/Call_8.wav',
  '../assets/audio/Call_9.wav',
  '../assets/audio/Call_10.wav',
  '../assets/audio/Call_11.wav'
];

export class CallMove extends Move {

  private sound: Howl;
  private passSound: Howl;
  private soundStarted = false;
  private muted = false;

  constructor() {
    super();

    this.sound = new howler.Howl({
      src: [callSounds[Math.floor(Math.random() * callSounds.length)]],
      autoplay: false,
      loop: false
    });

    this.passSound = new howler.Howl({
      src: ['../assets/audio/pass.wav'],
      autoplay: false,
      loop: false
    });
  }

  mute(muted: boolean) {
    this.muted = muted;
    this.passSound.mute(muted);
    this.sound.mute(muted);
  }

  update(delta: number) {
    if (this.gameObject.game.speed > 1) {
      this.done = true;
      return;
    }

    if (!this.soundStarted) {
      this.soundStarted = true;
      this.sound.play();
      this.sound.on('end', () => {
        this.done = true;
        if (!this.muted) {
          this.passSound.play();
        }
      });
    }
  }

  dispose() {
    this.sound.stop();
    this.passSound.stop();
  }
}
