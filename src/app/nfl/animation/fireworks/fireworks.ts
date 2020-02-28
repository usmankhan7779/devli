export declare let require: any;
import * as _ from 'lodash';

const orange = '#FA5600',
  tan = '#DBC170',
  red = '#E01309',
  green = '#A0AF28',
  moss = '#003D04',
  sky = '#0051A4',
  blue = '#1010FF',
  yellow = '#FFFF00',
  faint = '#404060',
  white = '#FFFFFF';

export interface IFireworksOptions {
  timeline: any[];

  bgFillColor?: string;
  frameRateMin?: number;
  frameRateMax?: number;
  stepIntervalMin?: number;
  stepIntervalMax?: number;
  rocketIntervalMin?: number;
  rocketIntervalMax?: number;
  frameCacheSize?: number; // number of frames to generate in advance
  drag?: number; // velocity lost per frame
  gravity?: number; // downward acceleration
  wind?: number; // horizontal slide applied to everything each frame
  preload?: string[]; // URLs to load before allowing animation to start
  sprites?: { [key: string]: string };
  rasters?: { [key: string]: string };
  spriteColors?: { [key: string]: string[] };
  fov?: number;
  pxScale?: number;
  particleDensityMax?: number;
  particleDensityMin?: number;
  startCallback?: () => void;
  stepCallback?: () => void;
  burnoutModMin?: number;
  burnoutModMax?: number;
  delayTimeline?: number;
}

export class FireworksOptions implements IFireworksOptions {
  bgFillColor = '#000000';
  frameRateMin = 8;
  frameRateMax = 20;
  stepIntervalMin = 40;
  stepIntervalMax = 30;
  rocketIntervalMin = 6;
  rocketIntervalMax = 3;
  frameCacheSize = 2; // number of frames to generate in advance
  drag = 0.01; // velocity lost per frame
  gravity = 0.5; // downward acceleration
  wind = -0.1; // horizontal slide applied to everything each frame
  preload: string[] = []; // URLs to load before allowing animation to start
  sprites = { // images used in animation
    rocket: require('assets/fireworks/electric.png'),
    explosion: require('assets/fireworks/spark.png'),
    core: require('assets/fireworks/spark.png'),
    shell: require('assets/fireworks/electric.png'),
    ring: require('assets/fireworks/electric.png'),
    logo: require('assets/fireworks/star.png')
  };
  rasters = { // pixel maps to generate 2D fireworks arrays
    logo: require('assets/fireworks/w.png')
  };
  spriteColors = {
    rocket: [faint],
    explosion: [yellow, white],
    core: [orange, yellow, blue, white, moss],
    shell: [green, red, orange, tan, green, white, white, white, sky, blue],
    ring: [red, orange, white, sky, tan],
    logo: [blue, green, orange, sky]
  };
  fov = 500;
  pxScale = 1;
  particleDensityMax = 2.00;
  particleDensityMin = 0.25;
  startCallback = null;
  stepCallback = null;
  burnoutModMin = 5;
  burnoutModMax = 100;
  delayTimeline: number = null;
  timeline = [];
}

export class Fireworks extends FireworksOptions {

  private displayCanvas: HTMLCanvasElement;
  private w2: number;
  private h2: number;
  private displayContext: CanvasRenderingContext2D;
  private bgCanvas: HTMLCanvasElement;
  private bgContext: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private frameDueTime: number;
  private baseHref: string;
  private qualityScalar: number;
  private stopped = false;
  private particleDensity = 1;
  private startTime = null;
  private stepCache: number[] = [];
  private frameCache: HTMLCanvasElement[] = [];
  private burnoutMod = 100; // modulo for early burnout. higher number allows particles to last longer.
  private latency = 0;
  private renderQualityAcc = 0;
  private renderQualityCt = 0;
  private renderQualityAvg = 100;
  private renderQuality = 100; // on a scale of 0-100
  private lastStepTick = 0; // tick of last timeline step
  private lastRocketTick = 0; // tick of last rocket step
  private loading = 0; // images not yet loaded from server
  private imgs: { [key: string]: HTMLCanvasElement[] } = {}; // loaded sprites
  private particles: Particle[] = []; // all particles ever created
  spareParticles: Particle[] = []; // particles ready to be reused
  private frameStartTime: number = null;
  private stepInterval = 1; // ticks between timeline steps
  private rocketInterval = 3; // ticks between rockets in the same step
  private frameInterval = 50; // ms between rendered frames
  private timeDelta = 1; // time elapsed per frame
  private frameRate = 20; // frames per second
  private timer: number; // from setInterval
  private tick = 0; // one per rendered frame
  private rocket: number = null; // index in the current step
  private step = 0; // one per timeline event

  constructor(options?: IFireworksOptions) {
    super();
    _.merge(this, options); // override the defaults
    this.loadSprites(); // blocks animation while loading sprites
  }

  initCanvas(canvas) {
    // This is the canvas that the user sees.
    this.displayCanvas = canvas;
    this.displayCanvas.width = this.displayCanvas.clientWidth; // * this.pxScale;
    this.displayCanvas.height = this.displayCanvas.clientHeight; // * this.pxScale;
    this.w2 = this.displayCanvas.clientWidth / 2;
    this.h2 = this.displayCanvas.clientHeight / 2;
    this.displayContext = this.displayCanvas.getContext('2d');
    this.displayContext.fillStyle = '#000';
    this.displayContext.fillRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);

    // This canvas holds the background.
    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.width = this.displayCanvas.width;
    this.bgCanvas.height = this.displayCanvas.height;
    this.bgContext = this.bgCanvas.getContext('2d');
    this.bgContext.fillStyle = '#000';
    this.bgContext.fillRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    this.fadeFrame();
  }

  newCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.displayCanvas.width;
    this.canvas.height = this.displayCanvas.height;
    this.context = this.canvas.getContext('2d');
  }

  start() {
    // console.log('Starting fireworks');
    this.stopped = false;
    this.frameDueTime = null;
    this.step = 0;
    if (this.preload.length) {
      this.preload.forEach(url => {
        ++this.loading;
        const img = new Image();
        img.src = url;
        img.onload = () => --this.loading;
      });
    }
    this.timer = window.setInterval(() => this.nextFrame(), 1);
    setTimeout(() => this.render(), 50);
    return this;
  }

  stop() {
    // console.log('Stopping fireworks');
    this.displayContext.fillStyle = '#000';
    this.displayContext.fillRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
    this.particles = [];
    this.spareParticles = [];
    this.stopped = true;
    clearInterval(this.timer);
    return this;
  }

  pause() {
    if (this.stopped) {
      this.start();
    } else {
      this.stop();
    }
  }

  /**
   * Converts HSV to RGB value.
   *
   * @param {Integer} h Hue as a value between 0 - 360 degrees
   * @param {Integer} s Saturation as a value between 0 - 100 %
   * @param {Integer} v Value as a value between 0 - 100 %
   * @returns {Array} The RGB values  EG: [r,g,b], [255,255,255]
   */
  hsvToRgb(h, s, v) {
    s = s / 100;
    v = v / 100;
    const hi = Math.floor((h / 60) % 6);
    const f = (h / 60) - hi;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let rgb = [];
    switch (hi) {
      case 0: rgb = [v, t, p]; break;
      case 1: rgb = [q, v, p]; break;
      case 2: rgb = [p, v, t]; break;
      case 3: rgb = [p, q, v]; break;
      case 4: rgb = [t, p, v]; break;
      case 5: rgb = [v, p, q]; break;
    }
    const r = Math.min(255, Math.round(rgb[0] * 256)),
      g = Math.min(255, Math.round(rgb[1] * 256)),
      b = Math.min(255, Math.round(rgb[2] * 256));
    return [r, g, b];
  }

  /**
   * Converts RGB to HSV value.
   *
   * @param {Integer} r Red value, 0-255
   * @param {Integer} g Green value, 0-255
   * @param {Integer} b Blue value, 0-255
   * @returns {Array} The HSV values EG: [h,s,v], [0-360 degrees, 0-100%, 0-100%]
   */
  rgbToHsv(r: number, g: number, b: number) {
    r = (r / 255);
    g = (g / 255);
    b = (b / 255);
    const min = Math.min(Math.min(r, g), b),
      max = Math.max(Math.max(r, g), b),
      delta = max - min;
    const value = max;
    let saturation;
    let hue;
    // Hue
    if (max === min) {
      hue = 0;
    } else if (max === r) {
      hue = (60 * ((g - b) / (max - min))) % 360;
    } else if (max === g) {
      hue = 60 * ((b - r) / (max - min)) + 120;
    } else if (max === b) {
      hue = 60 * ((r - g) / (max - min)) + 240;
    }
    if (hue < 0) {
      hue += 360;
    }
    // Saturation
    if (max === 0) {
      saturation = 0;
    } else {
      saturation = 1 - (min / max);
    }
    return [Math.round(hue), Math.round(saturation * 100), Math.round(value * 100)];
  }

  hexToRgb(hex: string) {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [r, g, b];
  }

  hexToHsv(hex: string) {
    return this.rgbToHsv.apply({}, this.hexToRgb(hex));
  }

  loadSprites() {
    _.forEach(this.sprites, (url, name) => {
      ++this.loading;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (typeof this.imgs[name] !== 'object') {
          this.imgs[name] = [];
        }
        this.varySprite(name, img);
        --this.loading;
      };
    });

    _.forEach(this.rasters, (url, name) => {
      ++this.loading;
      this.rasters[name] = new Image();
      this.rasters[name].src = url;
      this.rasters[name].onload = () => --this.loading;
    });
  }

  varySprite(name, img) {
    let canvas = document.createElement('canvas'), c = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    c.drawImage(img, 0, 0);
    const imageData = c.getImageData(0, 0, img.width, img.height);
    const pix = imageData.data.length / 4;
    const pixHsv = [];
    let sat = 0;
    for (let p = 0; p < pix; ++p) {
      const i = p * 4;
      pixHsv[p] = this.rgbToHsv(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);
      if (pixHsv[p][1] > sat) {
        sat = pixHsv[p][1];
      }
    }
    const colors = this.spriteColors[name];
    for (let color = 0; color < colors.length; ++color) {
      const colorHsv = this.hexToHsv(colors[color]);
      for (let p = 0; p < pix; ++p) {
        const rgb = this.hsvToRgb(colorHsv[0], colorHsv[1] * pixHsv[p][1] / sat, colorHsv[2] * pixHsv[p][2] / 100);
        const i = p * 4;
        imageData.data[i] = rgb[0];
        imageData.data[i + 1] = rgb[1];
        imageData.data[i + 2] = rgb[2];
      }
      canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      c = canvas.getContext('2d');
      c.putImageData(imageData, 0, 0);
      this.imgs[name].push(canvas);
      for (let p = 0; p < pix; ++p) {
        const rgb = this.hsvToRgb(colorHsv[0], colorHsv[1] * pixHsv[p][1] / sat, (200 + colorHsv[2] * pixHsv[p][2] / 100) / 3);
        const i = p * 4;
        imageData.data[i] = rgb[0];
        imageData.data[i + 1] = rgb[1];
        imageData.data[i + 2] = rgb[2];
      }
      canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      c = canvas.getContext('2d');
      c.putImageData(imageData, 0, 0);
      this.imgs[name].push(canvas);
    }
  }

  launchRocket(data) {

    const pos = new Vector3(Math.random() * this.displayCanvas.width - this.w2, 100 - this.h2, Math.random() * 4 - 2);
    this.explodeCore(pos, data[0]);
    this.explodeShell(pos, data[1], null);
    this.explodeRing(pos, data[2], null);


    // this.getParticle({
    //   scale: .15,
    //   streak: 5,
    //   drag: 1.008,
    //   pos: new Vector3(Math.random() * 100 - 50, 260, Math.random() * 4 - 2),
    //   vel: new Vector3(Math.random() * 20 - 10, Math.random() * 5 - 23, Math.random() * 3),
    //   img: this.randomArrayItem(this.imgs.rocket),
    //   data: data,
    //   expendable: false,
    //   cont: (particle: Particle) => {
    //     // Continue while rising
    //     if (particle.vel.y < -1.5) {
    //       return true;
    //     }
    //     // Spawn explosions
    //     particle.streak = null;
    //     this.explodeCore(particle.pos, particle.data[0]);
    //     this.explodeShell(particle.pos, particle.data[1], particle);
    //     this.explodeRing(particle.pos, particle.data[2], particle);
    //     // Become bright, expand, contract, fade away
    //     particle.img = this.randomArrayItem(this.imgs.explosion);
    //     particle.vel = new Vector3(0, 0, 0);
    //     particle.grav = 0.1;
    //     const x = Math.max(Math.sqrt(particle.data[0]) / 20, 0.25);
    //     particle.scales = [2, 4, 6, 5, 4, 3, 2, 0].map(s => s * x);
    //     particle.cont = (part: Particle) => part.scale = part.scales.shift();
    //     return true;
    //   }
    // });
  }

  explodeShell(pos, mag: number, op) {
    if (mag <= 0) {
      return;
    }
    const root = Math.sqrt(mag) + 1;
    const vel = new Vector3(root, root, root);
    const scale = 0.15 + Math.random() * 0.1;
    const cont = (p: Particle) => { p.streak = 6; this.decrementTimer(p); return p.timer > 0 || Math.random() > 0.25; };
    const imgs = [];
    do {
      imgs.push(this.randomArrayItem(this.imgs.shell));
    } while (Math.random() > 0.7);
    const numP = 10 + this.scaleParticleCount(mag * 2);
    const myPos = new Vector3(pos.x, pos.y, pos.z);
    // Spawn a symmetrical pair of particles at a time
    for (let i = 0; i < numP; i += 2) {
      vel.rotate(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      const myVel = vel.copy().multiplyEq((Math.random() + 19) / 20);
      this.getParticle({
        scale: scale,
        pos: myPos.copy(),
        vel: myVel,
        grav: 0.3,
        drag: 0.92,
        cont: cont,
        img: this.randomArrayItem(imgs),
        timer: 21,
        // x2d: op.x2d,
        // y2d: op.y2d
      });
      this.getParticle({
        scale: scale,
        pos: myPos.copy(),
        vel: myVel.invert(),
        grav: 0.3,
        drag: 0.91,
        cont: cont,
        img: this.randomArrayItem(imgs),
        timer: 21,
        // x2d: op.x2d,
        // y2d: op.y2d
      });
    }
  }

  explodeRing(pos, mag, op) {
    if (mag <= 0) {
      return;
    }
    const root = Math.sqrt(mag) * 0.8 + 1;
    const vel = new Vector3(root, 0, root);
    const cont = (p: Particle) => { p.streak = 8; this.decrementTimer(p); return p.timer > 0 || Math.random() > 0.25; };
    const rX = 1 - 2 * Math.random();
    const rZ = 1 - 2 * Math.random();
    const scale = 0.15 + Math.random() * 0.1;
    const img = this.randomArrayItem(this.imgs.ring);
    const numP = 4 + this.scaleParticleCount(mag);
    const myPos = new Vector3(pos.x, pos.y, pos.z);
    for (let i = 0; i < numP; ++i) {
      vel.rotateY(Math.random() * 3);
      const myVel = vel.copy().rotateX(rX).rotateZ(rZ).multiplyEq(1.5 + Math.random() / 5);
      this.getParticle({
        pos: myPos.copy(),
        vel: myVel,
        grav: 0.3,
        drag: 0.91,
        cont: cont,
        img: img,
        scale: scale,
        timer: 20,
        // x2d: op.x2d,
        // y2d: op.y2d
      });
      this.getParticle({
        pos: myPos.copy(),
        vel: myVel.invert(),
        grav: 0.3,
        drag: 0.91,
        cont: cont,
        img: img,
        scale: scale,
        timer: 20,
        // x2d: op.x2d,
        // y2d: op.y2d
      });
    }
  }

  explodeCore(pos, mag) {
    if (mag <= 0) {
      return;
    }
    const root = Math.sqrt(mag) / 3;
    const vel = new Vector3(root, root, root);
    const cont = (p) => { this.decrementTimer(p); return p.timer > 0 || Math.random() > 0.25; };
    const numP = 2 + this.scaleParticleCount(mag / 20);
    for (let i = 0; i < numP; ++i) {
      vel.rotate(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      const myVel = vel.copy().multiplyEq(Math.random() / 2 + .25);
      this.getParticle({
        pos: pos.copy(),
        vel: myVel,
        grav: 0.2,
        drag: 0.93,
        cont: cont,
        img: this.imgs.core[0],
        imgs: this.imgs.core,
        scale: 0.6,
        timer: 23,
      });
      this.getParticle({
        pos: pos.copy(),
        vel: myVel.invert(),
        grav: 0.2,
        drag: 0.93,
        cont: cont,
        img: this.imgs.core[0],
        imgs: this.imgs.core,
        scale: 0.6,
        timer: 23,
      });
    }
  }

  explodeRaster(name, pos, mag) {
    if (mag <= 0) {
      return;
    }
    const fireworks = this;
    const root = Math.sqrt(mag);
    const cont = (p: Particle) => { fireworks.decrementTimer(p); return p.timer > 0 || Math.random() > 0.25; };
    // convert raster into array of particles
    const canvas = document.createElement('canvas');
    const c = canvas.getContext('2d');
    const raster = this.rasters[name];
    c.drawImage(raster, 0, 0, raster.width, raster.height);
    const imageData = c.getImageData(0, 0, raster.width, raster.height);
    let i = 0;
    const halfx = raster.width / 2, halfy = raster.height / 2;
    let x, y;
    const rx = Math.random() / 2 - 0.25, ry = Math.random() / 2 - 0.25, rz = Math.random() / 2 - 0.25;
    const img = this.randomArrayItem(this.imgs[name]);
    for (let row = 0; row < raster.height; ++row) {
      y = row - halfy;
      for (let col = 0; col < raster.width; ++col) {
        if (imageData.data[i + 3] > 127) {
          x = col - halfx;
          this.getParticle({
            pos: new Vector3(pos.x + x / 10, pos.y + y / 10, pos.z),
            vel: (new Vector3(x, y, 0)).multiplyEq(root / 10 + Math.random() / 10).rotate(rx, ry, rz),
            grav: .4,
            drag: .9,
            cont: cont,
            img: img,
            scale: 1,
            timer: 23,
            expendable: false,
          });
        }
        i += 4;
      }
    }
  }

  scaleParticleCount(c) {
    return c * this.particleDensity;
  }

  scaleByQuality(min, max) {
    return min + this.qualityScalar * (max - min);
  }

  getParticle(opts) {
    let particle;
    if (this.spareParticles.length === 0) {
      opts.fireworks = this;
      particle = new Particle(opts);
      this.particles.push(particle);
    } else {
      particle = this.spareParticles.shift();
      particle.reset(opts);
    }
    return particle;
  }

  draw3Din2D(particle: Particle) {
    if (particle.scale > 0) {
      const mult = 6; // magic number
      const scale = this.fov / (this.fov + particle.pos.z);
      const x2d = this.pxScale * ((particle.pos.x * scale) + this.w2);
      const y2d = this.pxScale * ((particle.pos.y * scale) + this.h2);
      if (particle.x2d === null) {
        // If particle was just spawned, estimate the previous postion for blur
        const scaleOld = this.fov / (this.fov + particle.pos.z - particle.vel.z);
        particle.x2d = this.pxScale * ((particle.pos.x - particle.vel.x) * scaleOld + this.w2);
        particle.y2d = this.pxScale * ((particle.pos.y - particle.vel.y) * scaleOld + this.h2);
      }
      // Think of transforms as LIFO: the first one called is the last one applied.
      this.context.translate(x2d, y2d); // 5: move the particle into position
      this.context.scale(scale, scale); // 4: scale for distance (pos.z)
      // Motion blur
      if (particle.streak) {
        const dx = x2d - particle.x2d;
        const dy = y2d - particle.y2d;
        let angle = Math.atan2(dy, dx);
        if (angle < 0) {
          angle += Math.PI * 2;
        }
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        this.context.rotate(angle); // 3: rotate to direction of motion
        this.context.translate(- distance / 2, 0); // 2: move center backward along direction of motion
        this.context.scale(1 + distance / mult * particle.streak, 1); // 1: scale by 2d projected distance
      }
      this.context.globalAlpha = particle.alpha;
      // draw image centered at origin
      const scaleMult = particle.scale * mult * this.pxScale;
      this.context.drawImage(particle.img, - scaleMult, - scaleMult, 2 * scaleMult, 2 * scaleMult);
      // reset to identity matrix
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      // save 2D projection coords for streak
      particle.x2d = x2d;
      particle.y2d = y2d;
    }
  }

  nextTick() {
    let inDelay = false;
    if (this.delayTimeline > 0) {
      if (this.frameStartTime < this.startTime + this.delayTimeline) { }
      inDelay = true;
    } else {
      this.delayTimeline = null;
    }

    if (!inDelay && this.rocket === null && this.tick >= this.lastStepTick + this.stepInterval) {
      this.rocket = 0;
      this.stepCache.push(this.step);
    } else {
      this.stepCache.push(null);
    }
    while (this.rocket !== null && this.tick >= this.lastRocketTick + this.rocketInterval) {
      const step = this.timeline[this.step];
      if (step) {
        if (typeof step[this.rocket] === 'object') {
          this.launchRocket(step[this.rocket]);
          this.lastRocketTick = this.tick - (this.rocket % 3);
        }
        ++this.rocket;
        if (typeof step[this.rocket] === 'undefined') {
          this.rocket = null;
          this.step++; // = ++this.step % this.timeline.length; // loop
          this.lastStepTick = this.tick;
        }
      } else {
        ++this.rocket;
        this.rocket = null;
      }
    }
    ++this.tick;
  }

  render() {
    // Auto-stop when all particles have been recycled
    if (this.particles.length && !_.some(this.particles, (p: Particle) => p.enabled)) {
      this.stop();
      return;
    }

    this.frameStartTime = (new Date()).getTime();
    if (this.loading > 0) {
      setTimeout(() => this.render(), 5);
      return;
    }
    if (this.frameDueTime === null) {
      this.frameDueTime = (new Date()).getTime() + 100;
    }
    if (this.frameCache.length >= this.frameCacheSize) {
      this.nextFrame();
      setTimeout(() => this.render(), 5);
      return;
    }
    if (typeof this.startCallback === 'function') {
      const delay = parseInt(this.startCallback.call(this), 10);
      this.startCallback = null;
      if (delay > 0) {
        setTimeout(() => this.render(), delay);
        return;
      }
    }
    if (this.startTime === null) {
      this.startTime = this.frameStartTime;
    }
    this.nextFrame();
    this.nextTick();
    // If the frame we're drawing is already late then skip the cache.
    let pushFrame = true;
    if (this.frameCache.length === 0 && this.frameStartTime >= this.frameDueTime) {
      pushFrame = false;
      this.canvas = this.displayCanvas;
      this.context = this.displayContext;
      this.fadeFrame();
      this.frameDueTime = this.frameStartTime + this.frameInterval;
    } else {
      this.newCanvas();
    }
    this.nextFrame();
    this.context.globalCompositeOperation = 'lighter';
    // Draw particles (unsorted because order is irrelevant in "lighter" mode)
    // this.particles.sort(this.compareZPos);
    this.timeDelta = Math.sqrt(this.frameRateMax / this.frameRate);
    for (let i = 0; i < this.particles.length; i++) {
      // Periodically check whether the next frame is due.
      if (pushFrame) { // && i % 5 == 0 )
        this.nextFrame();
      }
      // Particles burn out at a faster rate when the cache is thin.
      if (this.particles[i].expendable && (i + this.tick) % this.burnoutMod === 0) {
        this.particles[i].disable();
      } else {
        this.particles[i].update(this.timeDelta, i);
        if (this.particles[i].enabled) {
          this.draw3Din2D(this.particles[i]);
        }
      }
    }
    this.context.globalAlpha = 1;
    this.nextFrame();
    // this.nextFrame();
    if (pushFrame) {
      this.frameCache.push(this.canvas);
    } else {
      this.doStepCallback();
    }

    this.nextFrame();
    setTimeout(() => this.render(), 1);
  }

  doStepCallback() {
    const step = this.stepCache.shift();
    if (step !== null) {
      if (typeof this.stepCallback === 'function') {
        this.stepCallback.call(this, step);
      }
    }
  }

  fadeFrame() {
    // Fade the previous frame
    this.displayContext.globalCompositeOperation = 'source-over';
    this.displayContext.globalAlpha = 0.4;
    this.displayContext.drawImage(this.bgCanvas, 0, 0, this.displayCanvas.width, this.displayCanvas.height);
  }

  nextFrame() {
    if (this.stopped || !this.frameDueTime) {
      return;
    }
    const time = (new Date()).getTime();
    const late = time - this.frameDueTime;
    // Better to render a tiny bit early than very late.
    if (late < -2) {
      return;
    }
    this.latency = Math.max(0, late);
    if (this.frameCache.length === 0) {
      return;
    }
    // Slow and simplify the animation when the cache is thin
    this.updateRenderQuality();
    this.fadeFrame();
    // Add the next frame
    this.displayContext.globalCompositeOperation = 'lighter';
    this.displayContext.globalAlpha = 1;
    this.displayContext.drawImage(this.frameCache.shift(), 0, 0);
    this.doStepCallback();
    this.frameDueTime = time + this.frameInterval - Math.min(late, 10);
  }

  updateRenderQuality() {
    this.renderQualityAcc += this.renderQuality;
    this.renderQualityCt += 1;
    this.renderQualityAvg = this.renderQualityAcc / this.renderQualityCt;
    if (this.tick > 10) {
      const newQ = (this.frameCache.length * 1.25) / this.frameCacheSize * 100;
      if (this.tick > 50 && newQ < this.renderQuality) {
        this.renderQuality = newQ;
      } if (this.latency > this.frameInterval / 8) {
        this.renderQuality = Math.max(1, this.renderQuality - Math.min(10, this.latency));
      } else {
        if (this.renderQualityAvg > this.renderQuality) {
          this.renderQuality += Math.max(0.1, ((100 + this.renderQualityAvg) / 2 - this.renderQuality) / 50);
        } else {
          this.renderQuality = Math.min(100, this.renderQuality + 0.1);
        }
      }
    }
    // The quality curve falls rapidly off the maximum. 90 => 0.81; 80 => 0.64; 50 => 0.25; 20 => 0.04
    this.qualityScalar = Math.pow(this.renderQuality / 100, 2);
    this.frameRate = this.scaleByQuality(this.frameRateMin, this.frameRateMax);
    this.frameInterval = 1000 / this.frameRate;
    this.particleDensity = this.scaleByQuality(this.particleDensityMin, this.particleDensityMax);
    this.burnoutMod = this.scaleByQuality(this.burnoutModMin, this.burnoutModMax);
    this.stepInterval = this.scaleByQuality(this.stepIntervalMin, this.stepIntervalMax);
    this.rocketInterval = this.scaleByQuality(this.rocketIntervalMin, this.rocketIntervalMax);
  }

  decrementTimer(particle: Particle) {
    particle.timer -= this.timeDelta;
  }

  compareZPos(a, b) {
    return b.pos.z - a.pos.z;
  }

  randomArrayItem(array: any[], fun?) {
    let rand, idx;
    if (array.length === 0) {
      return;
    }
    if (array.length === 1) {
      return array[0];
    }
    if (typeof fun === 'function') {
      rand = fun.apply();
    } else {
      rand = Math.random();
    }
    idx = Math.floor(rand * array.length);
    return array[idx];
  }
}

class Vector3 {

  constructor(
    public x: number,
    public y: number,
    public z: number
  ) {
  }

  rotateX(angle) {
    const tz = this.z;
    const ty = this.y;
    const cosRX = Math.cos(angle);
    const sinRX = Math.sin(angle);
    this.z = (tz * cosRX) + (ty * sinRX);
    this.y = (tz * -sinRX) + (ty * cosRX);
    return this;
  }

  rotateY(angle) {
    const tx = this.x;
    const tz = this.z;
    const cosRY = Math.cos(angle);
    const sinRY = Math.sin(angle);
    this.x = (tx * cosRY) + (tz * sinRY);
    this.z = (tx * -sinRY) + (tz * cosRY);
    return this;
  }

  rotateZ(angle) {
    const ty = this.y;
    const tx = this.x;
    const cosRZ = Math.cos(angle);
    const sinRZ = Math.sin(angle);
    this.y = (ty * cosRZ) + (tx * sinRZ);
    this.x = (ty * -sinRZ) + (tx * cosRZ);
    return this;
  }

  rotate(ax, ay, az) {
    this.rotateX(ax).rotateY(ay).rotateZ(az);
    return this;
  }

  plusEq(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  multiplyEq(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  invert() {
    return new Vector3(0 - this.x, 0 - this.y, 0 - this.z);
  }

  copy() {
    return new Vector3(0 + this.x, 0 + this.y, 0 + this.z);
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  }
}

class Particle {

  pos: Vector3;
  vel: Vector3;
  grav = 1;
  drag = 1;
  enabled = true;
  data = null;
  scales: number[];
  scale = 1;
  streak: number = null;
  imgs: HTMLImageElement[];
  img: HTMLImageElement;
  expendable = true;
  alpha = 1;
  fireworks: Fireworks;
  x2d: number = null;
  y2d: number = null;
  timer: number;
  cont: (Particle) => boolean | number = (particle: Particle) => particle.enabled;

  constructor(opts) {
    this.reset(opts);
    return this;
  }


  reset(opts) {
    _.merge(this, opts);
    // Particles moving away from observer should appear less bright
    if (this.vel.z > 0) {
      this.alpha = 1 - (this.vel.z / this.vel.magnitude() * .75);
    }
  }

  update(delta, i) {
    if (this.enabled) {
      if (this.cont(this)) {
        while (delta > 0) {
          const mult = delta >= 1 ? 1 : delta;
          this.pos.plusEq(this.vel.copy().multiplyEq(mult));
          this.vel.multiplyEq((1 - this.fireworks.drag * mult) * this.drag);
          this.vel.y += this.fireworks.gravity * this.grav * mult;
          this.pos.x += this.fireworks.wind * mult;
          delta -= 1;
        }
        if (typeof this.imgs === 'object') {
          this.img = this.imgs[i % this.imgs.length];
        }
      } else {
        this.disable(true);
      }
    }
  }

  disable(force = false) {
    if (this.enabled && (this.expendable || force)) {
      this.enabled = false;
      this.fireworks.spareParticles.push(this);
    }
  }
}
