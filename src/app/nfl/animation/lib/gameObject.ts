import { Game } from './game';
import { Move } from './moves/move';
import { Point } from './point';

export abstract class GameObject {
  moves: Move[] = [];
  move: Move;
  private oldMoves: Move[] = [];

  location: Point;
  abstract game: Game;

  get outOfMoves() { return !this.move && !this.moves.length; }
  get moving() { return !!this.move || !!this.moves.length; }

  clearMoves() {
    this.moves = [];
    this.move = null;
  }

  addMoves(...moves: Move[]) {
    moves.forEach(m => {
      m.gameObject = this;
      this.moves.push(m);
    });
  }

  update(delta: number) {
    if (this.outOfMoves) {
      return;
    }

    if (!this.move || this.move.done) {
      this.move = this.moves.shift();
      if (this.move) {
        this.oldMoves.push(this.move);
        this.move.started = true;
      }
    }

    if (this.move) {
      this.move.update(delta);
    }
  }

  mute(muted: boolean) {
    this.oldMoves.forEach(m => m.mute(muted));
  }

  dispose() {
    this.oldMoves.forEach(m => m.dispose());
  }
}
