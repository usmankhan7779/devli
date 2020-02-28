import { Game } from '../game';
import { GameObject } from '../gameObject';
import { Move } from './move';

export class WaitForMove extends Move {
  constructor(
    private move: Move
  ) {
    super();
  }

  public update(delta: number) {
    this.done = this.move.done;
  }

  dispose() { }
}
