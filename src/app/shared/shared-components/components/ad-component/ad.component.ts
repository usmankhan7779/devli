import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-ad-component',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent {
  @Input() league: 'mlb' | 'nba' | 'nfl';

  constructor(
  ) { }

  onMessageHook (message: String) {
    console.log(message);
  }
}
