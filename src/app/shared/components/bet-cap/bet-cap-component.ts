import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-bet-cap',
  templateUrl: './bet-cap.component.html',
  styles: [`
    .cap-img {
      max-width: 500px;
      max-height: 185px;
    }
  `]
})
export class BetCapComponent implements OnInit {
  @Input() isMatchupsGatewayPage = false;
  @Input() league;
  imageUrl;
  imageAtl;
  breakpointArr: number[];
  @HostListener('window:resize', ['$event']) onResize($event) {
    let size = 'sm';
    if (!this.isMatchupsGatewayPage && $event.target.innerWidth > this.breakpointArr[0]) {
      size = 'md';
    }
    if ($event.target.innerWidth > this.breakpointArr[1]) {
      size = 'lg';
    }
    if (!this.isMatchupsGatewayPage && $event.target.innerWidth > this.breakpointArr[2]) {
      size = 'xl';
    }
    this.imageUrl = `/assets/images/${this.league}/bet-caps/bet-predictor-${size}.jpg`;
  }
  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
    if (this.isMatchupsGatewayPage) {
      this.breakpointArr = [0, 1469, 0];
    } else {
      this.breakpointArr = [1100, 1305, 1590];
    }
    this.imageUrl = `/assets/images/${this.league}/bet-caps/bet-predictor-sm.jpg`;
    this.imageAtl = `${this.league.toUpperCase()} Bet Predictor`;
    this.commonService.callOnResize(this.onResize.bind(this));
  }
}
