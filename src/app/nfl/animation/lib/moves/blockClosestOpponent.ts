import { Point } from '../point';
import { Player } from '../player';
import { Move } from './move';

export class BlockClosestOpponent extends Move {

  get speed() { return 0.015; }
  opponent: Player;
  gameObject: Player;

  update(delta: number) {
    if (!this.opponent) {
      const opponents = this.gameObject.game.play.players
        .filter(p => p.player.team !== this.gameObject.team && !p.player.playPlayer)
        .map(p => ({
          player: p.player,
          distance: Point.distance(this.gameObject.location, p.player.location)
        }))
        .sort((a, b) => a.distance - b.distance);

      const opponent = opponents.find(o => !o.player.target) || opponents[0];
      this.opponent = opponent.player;
      this.opponent.target = true;
    }

    const deltaX = this.opponent.location.x - this.gameObject.location.x;
    const deltaY = this.opponent.location.y - this.gameObject.location.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const ratio = delta * this.speed * this.gameObject.game.speed / distance;

    if (ratio >= 0.1) {
      // this.gameObject.location.x = this.opponent.location.x;
      // this.gameObject.location.y = this.opponent.location.y;
      this.done = true;
      this.opponent.move = null;
      this.opponent.moves = [];
    } else {
      this.gameObject.location.x += deltaX * ratio;
      this.gameObject.location.y += deltaY * ratio;
    }
  }

  dispose() { }
}
