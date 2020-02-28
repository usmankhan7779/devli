import { Point } from '../point';
import { GameObject } from '../gameObject';
import { Game } from '../game';
export abstract class Move {
  done: boolean;
  started = false;
  gameObject: GameObject;
  get destination(): Point { return this.gameObject.location; }
  get distance() { return 0; }
  get speed() { return 0; }

  start() {
    this.done = false;
  }

  mute(muted: boolean) { }

  abstract update(delta: number);

  abstract dispose();
}
