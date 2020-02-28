import * as tinyColor from 'tinycolor2';
import * as howler from 'howler';

import { Ball } from './ball';
import { GameData } from './data/gameData';
import { ImageLoader } from './imageLoader';
import { Play, PlayKinds } from './play';
import { Player } from './player';
import { Point } from './point';

export declare let require: any;

export class Game {

  homeTeam: string;
  awayTeam: string;
  colors?: { [key: string]: string } = {};
  textColors?: { [key: string]: string } = {};
  plays: Play[] = [];
  scoringPlays: Play[] = [];
  players: Player[];
  play: Play;
  score: { [key: string]: number };
  ball = new Ball(this);

  spriteSize: number;

  speed = 1;

  playIndex = -1;
  lastTimeStamp = 0;
  done: boolean;

  touchdown: (show: boolean) => void;

  private fieldImage: HTMLImageElement;
  private running = false;
  private lastRewind: number;

  private introSound: Howl;
  private crowdSound: Howl;
  private announcerSound: Howl;
  private highlightsSound: Howl;

  get isRunning() { return this.running; }

  constructor(
    public data: GameData,
    public readonly canvas: HTMLCanvasElement,
    private highlights: boolean
  ) {
    this.homeTeam = data.game.home_team;
    this.awayTeam = data.game.away_team;

    this.colors[this.homeTeam] = data.game.home_hex1;

    // Find the best color match
    const homeColor = tinyColor(data.game.home_hex1);
    const awayColor = tinyColor(data.game.away_hex1);
    const awayAltColor = tinyColor(data.game.away_hex2);
    this.colors[this.awayTeam] = tinyColor.mostReadable(homeColor, [awayColor, awayAltColor]).toHexString();

    this.textColors[this.homeTeam] = tinyColor.mostReadable(homeColor, [tinyColor('#fff'), tinyColor('#000')]).toHexString();
    // tslint:disable-next-line:max-line-length
    this.textColors[this.awayTeam] = tinyColor.mostReadable(tinyColor(this.colors[this.awayTeam]), [tinyColor('#fff'), tinyColor('#000')]).toHexString();

    this.score = {};
    this.score[this.homeTeam] = 0;
    this.score[this.awayTeam] = 0;

    let score: { [key: string]: number } = {};
    score[this.homeTeam] = 0;
    score[this.awayTeam] = 0;

    this.players = data.players.map(p => new Player(this, p, { x: 50, y: p.team === this.homeTeam ? -10 : 63 }));

    data.plays.forEach(p => {
      if (p.pos_team_id !== 'UNK') {
        const play = new Play(this, p, score);
        score = play.endScore;
        // tslint:disable-next-line:max-line-length
        if (!highlights || play.startScore[this.homeTeam] !== play.endScore[this.homeTeam] || play.startScore[this.awayTeam] !== play.endScore[this.awayTeam]) {
          this.plays.push(play);
        }
      }
    });

    if (!highlights) {
      data.scoring_plays.forEach(p => {
        const play = new Play(this, p, score);
        score = play.endScore;
        // tslint:disable-next-line:max-line-length
        this.scoringPlays.push(play);
      });
    }
  }

  async init() {
    this.fieldImage = await ImageLoader.load(require('assets/field.png'));
    await Player.loadImages();
    await Ball.loadImages();
    window.requestAnimationFrame(this.update);
    window.addEventListener('resize', this.resize);
    this.resize();

    if (!this.highlights) {
      this.introSound = new howler.Howl({
        src: ['../assets/audio/intro.wav'],
        autoplay: true,
        loop: true
      });

      this.crowdSound = new howler.Howl({
        src: ['../assets/audio/crowd_background_1.wav'],
        autoplay: false,
        loop: true
      });

      this.announcerSound = new howler.Howl({
        src: ['../assets/audio/play-button.wav'],
        autoplay: false,
        loop: false
      });
    } else {
      this.highlightsSound = new howler.Howl({
        src: ['../assets/audio/highlights.wav'],
        autoplay: true,
        loop: true,
        volume: 0.3
      });
    }
  }

  mute(muted: boolean) {
    if (this.crowdSound) {
      this.crowdSound.mute(muted);
    }

    if (this.introSound) {
      this.introSound.mute(muted);
    }

    if (this.highlightsSound) {
      this.highlightsSound.mute(muted);
    }
    this.players.forEach(p => p.mute(muted));
    this.ball.mute(muted);
  }

  dispose() {
    window.removeEventListener('resize', this.resize);
    this.running = false;
    this.players.forEach(p => p.dispose());
    this.ball.dispose();

    if (this.crowdSound) {
      this.crowdSound.stop();
    }

    if (this.introSound) {
      this.introSound.stop();
    }

    if (this.highlightsSound) {
      this.highlightsSound.stop();
    }
  }

  start() {
    if (this.done !== false) {
      // this.done could be undefined or true and that should work here
      if (!this.highlights) {
        this.introSound.fade(1, 0, 1000);
        this.introSound.once('fade', () => this.introSound.stop());
        this.crowdSound.play();
        this.crowdSound.volume(1);
        this.announcerSound.play();
      }
      this.done = false;
      this.playIndex = -1;
    }
    this.lastTimeStamp = 0;
    this.running = true;
    if (!this.play || this.play.done) {
      this.nextPlay();
    }
  }

  rewind() {
    if (this.lastRewind) {
      // this.lastRewind is normally null, when set then we're in a rewind
      // but on first click we don't want to go back 1 play yet, we just want to restart the current play
      this.playIndex--;
    }
    this.lastRewind = this.playIndex;
    this.startPlay();
  }

  pause() {
    this.running = false;
  }

  nextPlay() {
    this.lastRewind = null;
    if (this.playIndex < this.plays.length - 1) {
      this.playIndex++;
      this.startPlay();
    } else if (this.play) {
      this.play.stop();
      this.play.playEnded = null;
      this.play = null;
      this.done = true;
      this.running = false;
      if (!this.highlights) {
        this.introSound.play();
        this.introSound.volume(1);
        this.crowdSound.fade(1, 0, 1000);
        this.crowdSound.once('fade', () => this.crowdSound.stop());
      }
    }
  }

  startPlay(singleRun = false) {
    if (this.touchdown) {
      this.touchdown(false);
    }
    // lastTimeStamp is reset so that the delta is properly calculated on update
    this.lastTimeStamp = 0;
    this.running = true;
    const play = this.plays[this.playIndex];
    if (this.play) {
      this.play.stop();
      this.play.playEnded = null;
    }
    this.play = play;
    this.score = this.play.startScore;
    play.start();
    if (singleRun) {
      // This is a hack for when using debug controls to run play by play,
      // And upon play end, we pause the game
      play.playEnded = () => this.pause();
    } else {
      play.playEnded = () => this.nextPlay();
    }
  }

  yardsToPixels(yards: Point): Point {
    return {
      x: (this.canvas.width * (14.5 + yards.x)) / 128.75,
      y: (this.canvas.height * (2.3 + yards.y)) / 57.75
    };
  }

  fullTeamName(teamId: string) {
    if (teamId === this.homeTeam) {
      return this.data.game.home_team_name;
    } else {
      return this.data.game.away_team_name;
    }
  }

  private update = (timeStamp: number) => {
    if (this.running) {
      if (this.lastTimeStamp) {
        const delta = timeStamp - this.lastTimeStamp;
        if (this.play) {
          this.play.update(delta);
        }
        this.players.forEach(p => p.update(delta));
        this.ball.update(delta);
      }
      this.lastTimeStamp = timeStamp;
    }
    this.render();
    window.requestAnimationFrame(this.update);
  }

  private render() {
    if (!this.fieldImage) {
      return;
    }

    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.fieldImage, 0, 0, this.canvas.width, this.canvas.height);

    const color = tinyColor(this.data.game.home_hex1);
    context.fillStyle = color.lighten(10).toHexString();
    let ltl = this.yardsToPixels({ x: -10, y: 0 });
    let lbr = this.yardsToPixels({ x: 0, y: 53 });
    context.fillRect(ltl.x, ltl.y, (lbr.x - ltl.x) - 1, lbr.y - ltl.y);
    ltl = this.yardsToPixels({ x: 100, y: 0 });
    lbr = this.yardsToPixels({ x: 110, y: 53 });
    context.fillRect(ltl.x + 2, ltl.y, (lbr.x - ltl.x) - 3, lbr.y - ltl.y);

    context.save();
    const leftTxtPos = this.yardsToPixels({ x: -3, y: 26.5 });
    context.translate(leftTxtPos.x, leftTxtPos.y);
    context.rotate(Math.PI / -2);
    context.fillStyle = '#ffffff';
    context.font = '3vw sans-serif';
    context.textAlign = 'center';
    context.fillText(this.data.game.home_team_name, 0, 0);
    context.restore();

    context.save();
    const rightTxtPos = this.yardsToPixels({ x: 103, y: 26.5 });
    context.translate(rightTxtPos.x, rightTxtPos.y);
    context.rotate(Math.PI / 2);
    context.fillStyle = '#ffffff';
    context.font = '3vw sans-serif';
    context.textAlign = 'center';
    context.fillText(this.data.game.home_team_name, 0, 0);
    context.restore();

    if (this.play) {
      this.play.render(context);
    }
    this.players.forEach(p => p.render(context));
    this.ball.render(context);
  }

  resize = () => {
    const width = Math.floor(this.canvas.parentElement.offsetWidth);
    const height = Math.floor(this.canvas.parentElement.offsetHeight);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.spriteSize = this.canvas.width / 30;

    this.players.forEach(p => p.buildSprite());

    this.render();
  }
}
