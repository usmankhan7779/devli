import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fallback-img',
  template: `
    <img [hidden]="imageLoaded" class="player-image-cap" [src]="imageCap" alt="{{alt}}">
    <img [hidden]="!imageLoaded" (load)="onImageLoad()" [src]="photoUrl" alt="{{alt}}">
  `,
  styles: [`
    :host {
      height: inherit;
    }
    :host img {
      height: inherit;
    }
  `]
})
export class FallbackImgComponent implements OnInit {
  @Input() alt: string;
  @Input() photoUrl: string;
  @Input() imageCap = 'https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/nfl/low-res/0.png';

  imageLoaded: boolean;

  constructor(
  ) { }

  ngOnInit() {
    this.imageLoaded = false;
  }

  onImageLoad() {
    this.imageLoaded = true
  }

}
