import * as _ from 'lodash';
import { PlayData } from './data/playData';
import { Defense1, Defense2 } from './formations/defense';
import { Formation, FormationPlayer } from './formations/formation';
import { PassingOffense1, PassingOffense2, PassingOffense3, RunningOffense1, RunningOffense2 } from './formations/offense';
import { ExtraPointKick, ExtraPointKickDefense, KickOff, KickOffReturn, Punt, PuntDefense } from './formations/special';
import { Game } from './game';
import { BlockClosestOpponent } from './moves/blockClosestOpponent';
import { CallMove } from './moves/callMove';
import { CatchBall } from './moves/catchBall';
import { FollowBallUntilMove } from './moves/followBallUntilMove';
import { FollowPlayerUntilMove } from './moves/followPlayerUntilMove';
import { Kick } from './moves/kick';
import { LeaveField } from './moves/leaveField';
import { Move } from './moves/move';
import { MoveToLocation } from './moves/moveToLocation';
import { TacklePlayer } from './moves/tacklePlayer';
import { TakeBallToLocation } from './moves/takeBallToLocation';
import { ThrowBall } from './moves/throwBall';
import { WaitForBall } from './moves/waitForBall';
import { WaitForMove } from './moves/waitForMove';
import { Player } from './player';
import { Point } from './point';

/* angular cli fix https://github.com/angular/angular-cli/issues/8536 */
const Phases = {
  '0': 'Setup',
  '1': 'Play',
  '2': 'End',
  'Setup': 0,
  'Play': 1,
  'End': 2
};

enum _Phases {
  Setup,
  Play,
  End
}
/* angular cli fix https://github.com/angular/angular-cli/issues/8536 */
export const PlayKinds = {
  '0': 'Pass',
  '1': 'Rush',
  '2': 'KickOff',
  '3': 'ExtraPoint',
  '4': 'FieldGoal',
  '5': 'Punt',
  'Pass': 0,
  'Rush': 1,
  'KickOff': 2,
  'ExtraPoint': 3,
  'FieldGoal': 4,
  'Punt': 5,
};

export enum _PlayKinds {
  Pass,
  Rush,
  KickOff,
  ExtraPoint,
  FieldGoal,
  Punt
}

export class Play {

  leftFieldTeam: string;
  rightFieldTeam: string;
  offenseTeam?: string;
  defenseTeam?: string;
  endScore: { [key: string]: number };
  down: string;
  timeAndQuarter: string;
  time: string;
  seconds: number;
  quarter: number;
  yardLine: number;
  friendlyYardline: string;
  done: boolean;
  description = '';
  playKind: _PlayKinds;
  touchdown = false;
  touchdownTeam: string;
  playEnded: () => void;

  get finalDescription() { return this.data.description; }

  private elapsed: number;
  players: FormationPlayer[];
  private phase: _Phases;
  private direction = 1;
  private lateralActionLocation: number;

  constructor(
    public game: Game,
    public data: PlayData,
    public startScore: { [key: string]: number }
  ) {
    this.setKind();
    this.setEndScore();
    this.down = this.getDown();
    this.getTime();

    if (data.pos_team_id === game.homeTeam) {
      this.offenseTeam = game.homeTeam;
      this.defenseTeam = game.awayTeam;
    } else {
      this.offenseTeam = game.awayTeam;
      this.defenseTeam = game.homeTeam;
    }

    if (this.quarter % 2 === 1) {
      this.leftFieldTeam = game.homeTeam;
      this.rightFieldTeam = game.awayTeam;
    } else {
      this.leftFieldTeam = game.awayTeam;
      this.rightFieldTeam = game.homeTeam;
    }

    this.yardLine = this.fieldPosToYards(data.yardline);
    if (this.offenseTeam === this.rightFieldTeam) {
      this.yardLine = 100 - this.yardLine;
      this.direction = -1;
    }

    if (this.yardLine <= 50) {
      this.friendlyYardline = `${this.leftFieldTeam} ${this.yardLine}`;
    } else {
      this.friendlyYardline = `${this.rightFieldTeam} ${100 - this.yardLine}`;
    }

    this.setLateralActionLocation();
    this.pickPlayers();
  }

  start() {
    // tslint:disable-next-line:no-console
    // console.info('Setup phase!', this.data, this.data.play_players);
    this.phase = Phases.Setup;
    this.elapsed = 0;
    this.game.players.forEach(p => {
      p.clearMoves();
      p.tackled = false;
      p.playPlayer = this.data.play_players.find(pp => pp.player_id === p.id);
    });
    this.players.forEach(p => {
      // HACK: reset the move for when we rewind
      p.move.done = false;
      p.player.addMoves(p.move);
      p.player.jerseyPosition = (p.player.playPlayer && p.player.playPlayer.player_position) || p.position.position[0];
      p.player.buildSprite();
    });
    this.game.players.forEach(p => {
      if (p.outOfMoves && !p.onTheBench) {
        p.addMoves(new LeaveField());
      }
    });

    this.game.ball.clearMoves();
    this.game.ball.location = { x: this.yardLine, y: 26.5 };
  }

  stop() {
    // this.game.players.forEach(p => p.clearMoves());
    this.done = true;
    this.phase = Phases.Setup;
    this.elapsed = 0;
  }

  update(delta: number) {
    switch (this.phase) {
      case Phases.Setup:
        if (!_.some(this.game.players, (p: Player) => p.moving)) {
          this.elapsed = 0;
          this.phase = Phases.Play;
          this.addMoves();
          this.description = this.data.description && this.data.description.replace(/\(.*?\)/g, '');
          // tslint:disable-next-line:no-console
          // console.info('Play phase!');
        }
        break;
      case Phases.Play:
        this.elapsed += delta * this.game.speed;
        if (this.elapsed >= 8000 || (!_.some(this.game.players, (p: Player) => p.moving) && !this.game.ball.moving)) {
          // if (!_.some(this.game.players, (p: Player) => p.moving) && !this.game.ball.moving) {
          this.elapsed = 0;
          this.phase = Phases.End;
          if (this.touchdown && this.game.touchdown) {
            this.game.touchdown(true);
          }
          this.game.score = this.endScore;
          // tslint:disable-next-line:no-console
          // console.info('End phase!');
        }
        break;
      case Phases.End:
        this.elapsed += delta * this.game.speed;
        if (this.elapsed >= (this.touchdown ? 5000 : 2000)) {
          if (this.touchdown && this.game.touchdown) {
            this.game.touchdown(false);
          }
          if (this.playEnded) {
            this.playEnded();
          }
          this.stop();
        }
        break;
    }
  }

  render(context: CanvasRenderingContext2D) { }

  dispose() { }

  private setKind() {
    switch (this.data.note) {
      case 'KICKOFF':
        this.playKind = PlayKinds.KickOff;
        break;
      case 'XP':
      case 'XPM':
        this.playKind = PlayKinds.ExtraPoint;
        break;
      case 'FG':
        this.playKind = PlayKinds.FieldGoal;
        break;
      case 'PUNT':
        this.playKind = PlayKinds.Punt;
        break;
      default:
        if (/punt/i.test(this.data.description)) {
          this.playKind = PlayKinds.Punt;
        } else {
          if (_.some(this.data.play_players, p => p.passing_att)) {
            this.playKind = PlayKinds.Pass;
          } else {
            this.playKind = PlayKinds.Rush;
          }
        }
        break;
    }
  }

  private setEndScore() {
    const score = _.clone(this.startScore);
    if (this.data.play_players) {
      // using find to stop at first score found
      this.data.play_players.find(player => {
        return !!_.keys(player).find(k => {
          if (/_tds/.test(k)) {
            score[player.team_id] += 6;
            this.touchdown = true;
            this.touchdownTeam = player.team_id;
            return true;
          } else {
            switch (k) {
              case 'kicking_xpmade':
                score[player.team_id] += 1;
                return true;
              case 'kicking_fgm':
                score[player.team_id] += 3;
                return true;
              case 'defense_safe':
                score[player.team_id] += 2;
                return true;
              case 'passing_twoptm':
                score[player.team_id] += 2;
                return true;
            }
          }
          return false;
        });
      });
    }
    this.endScore = score;
  }

  private getDown() {
    switch (this.data.down) {
      case 1:
        return `1st & ${Math.round(this.data.yards_to_go)}`;
      case 2:
        return `2nd & ${Math.round(this.data.yards_to_go)}`;
      case 3:
        return `3rd & ${Math.round(this.data.yards_to_go)}`;
      case 4:
        return `4th & ${Math.round(this.data.yards_to_go)}`;
      default:
        return '--';
    }
  }

  private getTime() {
    const matches = /\(Q(\d),(\d+)\)/.exec(this.data.time);
    if (matches) {
      this.seconds = parseInt(matches[2], 10);
      this.time = `${Math.floor(this.seconds / 60)}:${_.padStart((this.seconds % 60).toString(), 2, '0')}`;
      switch (matches[1]) {
        case '1':
          this.quarter = 1;
          this.timeAndQuarter = '1st ' + this.time;
          return;
        case '2':
          this.quarter = 2;
          this.timeAndQuarter = '2nd ' + this.time;
          return;
        case '3':
          this.quarter = 3;
          this.timeAndQuarter = '3rd ' + this.time;
          return;
        case '4':
          this.quarter = 4;
          this.timeAndQuarter = '4th ' + this.time;
          return;
        default:
          this.timeAndQuarter = '--';
      }
    }
  }

  private pickPlayers() {
    let offenseFormation: typeof Formation, defenseFormation: typeof Formation;
    const importantOffensePlayers: Player[] = [], importantDefensePlayers: Player[] = [];

    if (this.data.play_players) {
      this.data.play_players.forEach(pp => {
        const player = this.game.players.find(p => p.id === pp.player_id);
        if (!player) {
          throw new Error(`No player found with id ${pp.player_id}`);
        }
        player.playPlayer = pp;
        if (player.team === this.offenseTeam) {
          importantOffensePlayers.push(player);
        } else {
          importantDefensePlayers.push(player);
        }
      });
    }

    const allOffensePlayers = this.game.players.filter(p => p.team === this.offenseTeam);
    const allDefensePlayers = this.game.players.filter(p => p.team === this.defenseTeam);

    const offenseLeft = this.offenseTeam === this.leftFieldTeam;

    switch (this.playKind) {
      case PlayKinds.KickOff:
        offenseFormation = KickOff;
        defenseFormation = KickOffReturn;
        break;
      case PlayKinds.ExtraPoint:
      case PlayKinds.FieldGoal:
        offenseFormation = ExtraPointKick;
        defenseFormation = ExtraPointKickDefense;
        break;
      case PlayKinds.Punt:
        offenseFormation = Punt;
        defenseFormation = PuntDefense;
        break;
      case PlayKinds.Pass:
        offenseFormation = [PassingOffense1, PassingOffense2, PassingOffense3][Math.floor(Math.random() * 3)];
        defenseFormation = [Defense1, Defense2][Math.floor(Math.random() * 2)];
        break;
      case PlayKinds.Rush:
        offenseFormation = [RunningOffense1, RunningOffense2][Math.floor(Math.random() * 2)];
        defenseFormation = [Defense1, Defense2][Math.floor(Math.random() * 2)];
        break;
    }

    const offense = new offenseFormation(this.game, importantOffensePlayers, allOffensePlayers, this.yardLine, offenseLeft);
    const defense = new defenseFormation(this.game, importantDefensePlayers, allDefensePlayers, this.yardLine, !offenseLeft);

    this.players = offense.pickPlayers().concat(defense.pickPlayers());
  }

  private addMoves() {
    if (this.data.note === 'PENALTY') {
      return;
    }

    let callMove: Move;

    switch (this.playKind) {
      case PlayKinds.KickOff:
        this.setupKickoffMoves();
        break;
      case PlayKinds.ExtraPoint:
        this.setupExtraPointMoves();
        break;
      case PlayKinds.FieldGoal:
        this.setupFieldGoalMoves();
        break;
      case PlayKinds.Punt:
        this.setupPuntMoves();
        break;
      case PlayKinds.Pass:
        callMove = this.setupPassMoves();
        break;
      case PlayKinds.Rush:
        callMove = this.setupRushMoves();
        break;
    }

    this.players.forEach(p => {
      if (!p.player.playPlayer && !p.player.onTheBench) {
        if (callMove) {
          p.player.addMoves(new WaitForMove(callMove));
        }
        p.player.addMoves(new BlockClosestOpponent());
      }
    });
  }

  private setupKickoffMoves() {
    const kicker = this.findPlayer('kicking_tot');
    let catcher = this.findPlayer('kickret_ret');
    const tacklers = this.findPlayers('defense_tkl', 'defense_ast');

    const ballDrop = {
      x: this.yardLine + (this.direction * kicker.playPlayer.kicking_yds),
      y: this.lateralActionLocation
    };

    if (!catcher && kicker.playPlayer.kicking_touchback) {
      // HACK: pick a catcher for touchbacks when no cathcer specified
      catcher = this.players
        .filter(p => p.player.team !== kicker.team)
        .map(p => ({
          dist: Math.abs(p.player.location.x - ballDrop.x),
          player: p
        }))[0].player.player;

      catcher.playPlayer = {
        kickret_yds: -this.direction * ((50 + this.direction * 52) - ballDrop.x)
      };
    }

    kicker.addMoves(new MoveToLocation(Point.clone(this.game.ball.location)));
    const kick = new Kick(Point.clone(ballDrop));
    kicker.addMoves(kick);

    if (catcher) {
      const returnStop = {
        x: ballDrop.x - this.direction * catcher.playPlayer.kickret_yds,
        y: this.lateralActionLocation
      };

      const takeBallMove = new TakeBallToLocation(returnStop, !!catcher.playPlayer.kickret_tds);

      catcher.addMoves(
        new WaitForMove(kick),
        new MoveToLocation(Point.clone(ballDrop)),
        new WaitForBall(),
        takeBallMove
      );

      if (tacklers && tacklers.length) {
        tacklers.forEach(t => t.addMoves(
          new WaitForMove(kick),
          new FollowBallUntilMove(takeBallMove),
          new TacklePlayer(catcher)
        ));
      }
    }
  }

  private setupExtraPointMoves() {
    const kicker = this.findPlayer('kicking_xpa');
    const holder = this.players.find(p => _.includes(p.position.position, 'HLD')).player;
    holder.playPlayer = {}; // Keeps the holder from getting default moves
    const kickLocation = {
      x: this.yardLine - this.direction * 6,
      y: 26.5
    };

    const ballMove = new MoveToLocation(kickLocation);
    this.game.ball.addMoves(ballMove);
    kicker.addMoves(
      new WaitForMove(ballMove),
      new MoveToLocation(kickLocation)
    );
    if (kicker.playPlayer.kicking_xpmade === 1) {
      kicker.addMoves(new Kick({
        x: this.yardLine + this.direction * 40,
        y: 26.5
      }));
    } else if (kicker.playPlayer.kicking_xpmissed === 1) {
      kicker.addMoves(new Kick({
        x: this.yardLine + this.direction * 40,
        y: this.lateralActionLocation
      }));
    }
  }

  private setupFieldGoalMoves() {
    const kicker = this.findPlayer('kicking_fga');
    const holder = this.players.find(p => _.includes(p.position.position, 'HLD')).player;
    holder.playPlayer = {}; // Keeps the holder from getting default moves
    let kickMove: Move;

    const kickLocation = {
      x: this.yardLine - this.direction * 6,
      y: 26.5
    };

    const ballMove = new MoveToLocation(kickLocation);
    this.game.ball.addMoves(ballMove);

    kicker.addMoves(
      new WaitForMove(ballMove),
      new MoveToLocation(kickLocation)
    );
    if (kicker.playPlayer.kicking_fgm === 1) {
      kickMove = new Kick({
        x: this.yardLine + this.direction * 60,
        y: 26.5
      });
    } else if (kicker.playPlayer.kicking_fgmissed === 1) {
      kickMove = new Kick({
        x: this.yardLine + this.direction * 60,
        y: 40
      });
    }
    kicker.addMoves(kickMove);
  }

  private setupPuntMoves() {
    const kicker = this.findPlayer('punting_tot') || this.findPlayer('punt_tot');
    const returner = this.findPlayer('puntret_tot', 'puntret_fair', 'puntret_downed');
    const tacklers = this.findPlayers('defense_tkl', 'defense_ast');
    const fumbleRecoverer = this.findPlayer('fumbles_rec');

    let endLocation = {
      x: this.yardLine + this.direction * (kicker.playPlayer.punting_yds || kicker.playPlayer.punting_tot),
      y: this.lateralActionLocation
    };

    const kickMove = new Kick(endLocation);

    this.game.ball.addMoves(new MoveToLocation(kicker.location));
    kicker.addMoves(
      new WaitForBall(),
      kickMove
    );

    if (returner) {
      returner.addMoves(
        new WaitForMove(kickMove),
        new CatchBall()
      );
      if (returner.playPlayer.puntret_yds) {
        endLocation = {
          x: this.yardLine + this.direction * (kicker.playPlayer.punting_yds - returner.playPlayer.puntret_yds),
          y: this.lateralActionLocation
        };

        if (!!returner.playPlayer.puntret_tds) {
          endLocation.x -= this.direction * 5;
        }

        const runMove = new TakeBallToLocation(endLocation, !!returner.playPlayer.puntret_tds);
        returner.addMoves(runMove);

        if (tacklers && tacklers.length) {
          tacklers.forEach(t => {
            t.addMoves(
              new WaitForMove(kickMove),
              new FollowBallUntilMove(runMove),
              new TacklePlayer(returner)
            );
          });
        }

      }
      if (fumbleRecoverer) {
        fumbleRecoverer.addMoves(
          new WaitForMove(kickMove),
          new MoveToLocation(endLocation)
        );
      }
    }
  }

  private setupPassMoves() {
    const qb = this.players.find(p => p.player.position === 'QB' && p.player.team === this.offenseTeam).player;
    const receiver = this.findPlayer('receiving_yds', 'receiving_tar');
    const tacklers = this.findPlayers('defense_tkl', 'defense_ast');
    const defenseTacklers = tacklers.filter(p => p.team !== qb.team);
    const offenseTacklers = tacklers.filter(p => p.team === qb.team);
    const intercepter = this.findPlayer('defense_int');
    const callMove = new CallMove();

    const moveBallToQb = new MoveToLocation(qb.location);
    this.game.ball.addMoves(callMove, moveBallToQb);
    const passDistance = qb.playPlayer.passing_cmp_air_yds || qb.playPlayer.passing_incmp_air_yds || qb.playPlayer.passing_yds || 0;

    if (receiver) {
      const adjustment = (qb.playPlayer.passing_incmp === 1 || qb.playPlayer.passing_incmp_air_yds) ? 5 : 0;

      const receiveLocation = {
        x: this.yardLine + this.direction * (passDistance - adjustment),
        y: this.lateralActionLocation
      };

      // tslint:disable-next-line:max-line-length
      receiver.addMoves(
        new WaitForMove(callMove),
        new MoveToLocation(receiveLocation)
      );

      qb.addMoves(
        new WaitForBall(),
        new ThrowBall(receiver, {
          x: this.yardLine + this.direction * passDistance,
          y: this.lateralActionLocation
        })
      );
      if (receiver.playPlayer.receiving_yds) {
        const endLocation = {
          x: this.yardLine + this.direction * receiver.playPlayer.receiving_yds,
          y: this.lateralActionLocation
        };

        if (!!receiver.playPlayer.receiving_tds) {
          endLocation.x += this.direction * 5;
        }

        const takeBallMove = new TakeBallToLocation(endLocation, !!receiver.playPlayer.receiving_tds);
        receiver.addMoves(
          new WaitForBall(),
          takeBallMove
        );

        const totalDistance = Point.distance(receiver.location, receiveLocation) + Point.distance(receiveLocation, endLocation);

        if (defenseTacklers && defenseTacklers.length) {
          defenseTacklers.forEach(t => {
            const tackleDistance = Point.distance(t.location, endLocation);
            const speed = tackleDistance * 0.015 / totalDistance;
            t.addMoves(
              new WaitForMove(callMove),
              new MoveToLocation(endLocation, speed),
              new TacklePlayer(receiver)
            );
          });
        }
      }
    } else {
      this.game.ball.addMoves(
        new WaitForMove(callMove),
        new MoveToLocation({
          x: this.yardLine + this.direction * passDistance,
          y: this.lateralActionLocation
        })
      );
    }

    if (intercepter) {
      const catchBallMove = new CatchBall();
      intercepter.addMoves(
        new WaitForMove(moveBallToQb),
        catchBallMove
      );

      if (intercepter.playPlayer.defense_int_yds) {
        intercepter.addMoves(new TakeBallToLocation({
          x: this.yardLine + this.direction * (passDistance - intercepter.playPlayer.defense_int_yds),
          y: this.lateralActionLocation
        }, !!intercepter.playPlayer.defense_int_tds));
      }

      if (offenseTacklers && offenseTacklers.length) {
        offenseTacklers.forEach(t => {
          t.addMoves(
            new WaitForMove(catchBallMove),
            new TacklePlayer(intercepter)
          );
        });
      }
    }

    return callMove;
  }

  private setupRushMoves() {
    const runner = this.findPlayer('rushing_att', 'rushing_yds');
    const tacklers = this.findPlayers('defense_tkl', 'defense_ast');
    const qb = this.players.find(p => p.player.position === 'QB' && p.player.team === this.offenseTeam).player;
    const qbHit = this.findPlayer('defense_qbhit');

    const callMove = new CallMove();

    this.game.ball.addMoves(
      callMove,
      new MoveToLocation(qb.location)
    );

    if (runner) {
      const endLocation = {
        x: this.yardLine + this.direction * (runner.playPlayer.rushing_yds || 0),
        y: this.lateralActionLocation
      };

      if (!!runner.playPlayer.rushing_tds) {
        endLocation.x += this.direction * 5;
      }

      const waitForBall = new WaitForBall();
      runner.addMoves(
        new WaitForMove(callMove),
        new MoveToLocation(qb.location),
        waitForBall,
        new TakeBallToLocation(endLocation, !!runner.playPlayer.rushing_tds)
      );

      qb.addMoves(new WaitForMove(waitForBall));

      if (tacklers && tacklers.length) {
        const totalDistance = Point.distance(qb.location, runner.location) + Point.distance(qb.location, endLocation);
        tacklers.forEach(t => {
          const tackleDistance = Point.distance(t.location, endLocation);
          const speed = tackleDistance * 0.015 / totalDistance;

          t.addMoves(
            new WaitForMove(callMove),
            new MoveToLocation(endLocation, speed),
            new TacklePlayer(runner)
          );
        });
      }
    } else if (tacklers && tacklers.length) {
      // TODO: improve sack situations: the QB is not moved and multiple tacklers are not in sync
      tacklers.forEach(t => t.addMoves(
        new WaitForMove(callMove),
        new MoveToLocation(qb.location),
        new TacklePlayer(qb)
      ));
    }

    if (qbHit && !qbHit.playPlayer.defense_tkl) {
      qbHit.addMoves(
        new WaitForMove(callMove),
        new TacklePlayer(qb)
      );
    }

    return callMove;
  }

  private findPlayer(...actions: string[]) {
    const player = this.players.find(p => _.some(_.keys(p.player.playPlayer), k => _.some(actions, a => k.indexOf(a) >= 0)));
    return player && player.player;
  }

  private findPlayers(...actions: string[]) {
    return this.players
      .filter(p => _.some(_.keys(p.player.playPlayer), k => _.some(actions, a => k.indexOf(a) >= 0)))
      .map(p => p.player);
  }

  private fieldPosToYards(pos: string) {
    return parseInt(pos.replace(/\((.*)\)/, '$1'), 10) + 50;
  }

  private setLateralActionLocation() {
    let y: number;

    if (this.data.description.indexOf('out of bounds') >= 0) {
      // hack to handle out of bounds
      y = -2;
    } else if (/left end/i.test(this.data.description) || /wide left/i.test(this.data.description)) {
      y = Math.random() * 11;
    } else if (/left/i.test(this.data.description)) {
      y = 11 + Math.random() * 11;
    } else if (/right end/i.test(this.data.description) || /wide right/i.test(this.data.description)) {
      y = 42 + Math.random() * 11;
    } else if (/right/i.test(this.data.description)) {
      y = 31 + Math.random() * 11;
    } else {
      y = 22 + Math.random() * 9;
    }

    if (this.offenseTeam === this.rightFieldTeam) {
      y = 53 - y;
    }

    this.lateralActionLocation = y;
  }
}
