import { Player } from '../player';
import { Move } from './move';

export class FollowPlayerUntilMove extends Move {

  private originalDx: number;
  private originalDy: number;

  get speed() {
    return 0.015;
  }

  constructor(
    private target: Player,
    private targetMove: Move
  ) {
    super();
  }

  public update(delta: number) {
    this.done = this.targetMove.started;

    if (!this.originalDx) {
      this.originalDx = this.target.location.x - this.gameObject.location.x;
      this.originalDy = this.target.location.y - this.gameObject.location.y;
    }

    this.gameObject.location.x = this.target.location.x - this.originalDx;
    this.gameObject.location.y = this.target.location.y - this.originalDy;
  }

  dispose() { }
}
