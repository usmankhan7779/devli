import howler from 'howler';
import { Fireworks } from './fireworks';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-fireworks',
  templateUrl: './fireworks.component.html',
  styleUrls: ['./fireworks.component.scss']
})
export class FireworksComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvasRef: ElementRef;

  private fireworks: Fireworks;
  private sound: Howl;

  constructor() {
    this.sound = new howler.Howl({
      src: ['../assets/audio/Fireworks.wav'],
      autoplay: false,
      loop: false
    });
  }

  ngOnInit() {
    this.fireworks = new Fireworks({
      timeline: [
        [
          [0, 12, 12], [11, 12, 0], [12, 0, 10], [13, 12, 0], [12, 13, 0], [0, 12, 12], [13, 13, 0], [0, 11, 13],
          [0, 0, 11], [0, 0, 12], [13, 12, 0], [12, 13, 0]
        ]
      ]
    });
    this.fireworks.initCanvas(this.canvasRef.nativeElement);
  }

  start() {
    this.fireworks.start();
    this.sound.volume(1);
    this.sound.play();
    setTimeout(() => {
      this.sound.fade(1, 0, 500);
    }, 2000);
  }
}
