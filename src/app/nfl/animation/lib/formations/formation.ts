import { MoveToFormation } from '../moves/moveToFormation';
import { Game } from '../game';
import { Player } from '../player';
import { Move } from '../moves/move';
import * as _ from 'lodash';

export interface FormationPosition {
  fromBall: number;
  lateral: number;
  position: string[];
}

export interface FormationPlayer {
  player: Player;
  move: Move;
  position: FormationPosition;
}

export class Formation {
  protected positions: FormationPosition[];
  private maxDist: number;

  constructor(
    protected game: Game,
    protected importantPlayers: Player[],
    protected allPlayers: Player[],
    protected yardLine: number,
    protected leftField: boolean
  ) {
  }

  pickPlayers() {
    if (!this.maxDist) {
      this.maxDist = _.max(this.positions.map(p => p.fromBall));
    }

    const positions = _.clone(this.positions);
    const players: FormationPlayer[] = [];

    const ip: Player[] = [];

    // First, get the important players
    this.importantPlayers.forEach(p => {
      // tslint:disable-next-line:max-line-length
      const position = (_.some(_.keys(p.playPlayer), k => /puntret/.test(k)) && positions.find(pos => _.includes(pos.position, 'PR'))) // special to place punt returner
        || positions.find(pos => _.includes(pos.position, p.playPlayer.player_position) || _.includes(pos.position, p.position))
        || positions.find(pos => _.includes(pos.position, 'UNK'));
      if (!position) {
        ip.push(p);
      } else {
        _.remove(positions, position);
        players.push({
          player: p,
          move: this.makeMove(p, position),
          position
        });
      }
    });

    // This handles players that didn't have a matching position
    ip.forEach(p => {
      const position = positions[0];
      _.remove(positions, position);
      players.push({
        player: p,
        move: this.makeMove(p, position),
        position
      });
    });

    // Then, fill up the other slots
    const usedIds = _.map(this.importantPlayers, p => p.id);
    const availablePlayers = this.allPlayers.filter(p => !_.includes(usedIds, p.id));

    positions.sort((a, b) => a.position ? -1 : 1).forEach(position => {
      const player = availablePlayers.find(p => _.includes(position.position, p.position)) || availablePlayers[0];
      if (!player) {
        throw new Error('Could not find player');
      }
      _.remove(availablePlayers, player);
      players.push({
        player,
        move: this.makeMove(player, position),
        position
      });
    });

    return players;
  }

  private makeMove(player: Player, position: FormationPosition) {
    if (this.leftField) {
      const maxDist = Math.min(this.maxDist, this.yardLine + 5);
      const fromBall = position.fromBall <= 5 ? position.fromBall : Math.max(position.fromBall * maxDist / this.maxDist, 5);

      return new MoveToFormation({
        x: this.yardLine - fromBall,
        y: 26.5 + position.lateral
      });
    } else {
      const maxDist = Math.min(this.maxDist, 105 - this.yardLine);
      const fromBall = position.fromBall <= 5 ? position.fromBall : Math.max(position.fromBall * maxDist / this.maxDist, 5);

      return new MoveToFormation({
        x: this.yardLine + fromBall,
        y: 26.5 - position.lateral
      });
    }
  }
}
