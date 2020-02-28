import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-offense-payer-box',
  templateUrl: './offense-player-box.component.html',
  styleUrls: ['./offense-player-box.component.scss']
})
export class OffensePlayerBoxComponent implements OnInit{
  @Input() player: any;
  @Input() activeOffense: any;
  @Input() isOLine: any;
  imageLoaded: boolean;
  readonly imageCap = 'https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/nfl/low-res/0.png';
  constructor(
  ) {}

  ngOnInit() {
    this.imageLoaded = false;
  }

  onImageLoad() {
    this.imageLoaded = true
  }
}
