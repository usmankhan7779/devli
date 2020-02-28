import { PlayerData } from './data/playerData';
import { PlayPlayerData } from './data/playPlayerData';
import { Game } from './game';
import { GameObject } from './gameObject';
import { ImageLoader } from './imageLoader';
import { Point } from './point';

export declare let require: any;

export class Player extends GameObject {

  private static jersey: HTMLImageElement;
  private static stripes: HTMLImageElement;
  private canvas: HTMLCanvasElement;

  tackled = false;
  target = false;

  playPlayer: PlayPlayerData;
  jerseyPosition: string;

  static async loadImages() {
    this.jersey = await ImageLoader.load(require('assets/jersey.png'));
    this.stripes = await ImageLoader.load(require('assets/stripes.png'));
  }

  get position() { return this.data.position; }
  get id() { return this.data.player_id; }
  get team() { return this.data.team; }
  get onTheBench() { return this.location.x === this.benchLocation.x && this.location.y === this.benchLocation.y; }

  constructor(
    public game: Game,
    private data: PlayerData,
    public benchLocation: Point
  ) {
    super();
    this.location = {
      x: benchLocation.x,
      y: benchLocation.y
    };
  }

  clearMoves() {
    super.clearMoves();
    this.target = false;
  }

  render(context: CanvasRenderingContext2D) {
    if (!this.canvas) {
      return;
    }

    const pos = this.game.yardsToPixels(this.location);
    if (this.tackled) {
      context.save();
      context.translate(pos.x, pos.y);
      context.rotate(Math.PI * 0.25);
      context.drawImage(this.canvas, - this.game.spriteSize / 2, - this.game.spriteSize / 2);
      context.restore();
    } else {
      context.drawImage(this.canvas, pos.x - this.game.spriteSize / 2, pos.y - this.game.spriteSize / 2);
    }
  }

  dispose() {
    super.dispose();

    this.removeIfExists(this.canvas);
    this.canvas = null;
    this.removeIfExists(Player.jersey);
    Player.jersey = null;
    this.removeIfExists(Player.stripes);
    Player.stripes = null;
  }

  buildSprite() {
    if (!Player.jersey || !Player.stripes) {
      return;
    }

    this.removeIfExists(this.canvas);

    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    this.canvas = canvas;

    canvas.width = this.game.spriteSize;
    canvas.height = this.game.spriteSize;

    const context = canvas.getContext('2d');

    context.fillStyle = this.game.colors[this.data.team];
    context.fillRect(0, 0, this.game.spriteSize, this.game.spriteSize);

    context.globalCompositeOperation = 'destination-in';
    context.drawImage(Player.jersey, 0, 0, this.game.spriteSize, this.game.spriteSize);

    context.globalCompositeOperation = 'source-over';
    context.drawImage(Player.stripes, 0, 0, this.game.spriteSize, this.game.spriteSize);

    context.fillStyle = this.game.textColors[this.data.team];
    context.textAlign = 'center';
    context.font = `${Math.floor(this.game.spriteSize / 3.9)}px sans-serif`;
    context.fillText(this.jerseyPosition, this.game.spriteSize / 2, this.game.spriteSize * 0.47);
    context.font = `${Math.floor(this.game.spriteSize / 2.9)}px sans-serif`;
    context.fillText(this.data.number.toString(), this.game.spriteSize / 2, this.game.spriteSize * 0.8);
  }

  private removeIfExists(element: HTMLElement) {
    if (element) {
      element.parentElement.removeChild(element);
    }
  }
}
