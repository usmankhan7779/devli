import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-monkey-knife-fight',
  templateUrl: './monkey-knife-fight.component.html',
  styleUrls: ['./monkey-knife-fight.component.scss']
})
export class MonkeyKnifeFightComponent implements OnInit {
  @Input() league: 'mlb' | 'nba' | 'nfl' = 'mlb';
  urlToGo: string;
  constructor() {}

  ngOnInit() {
    if (this.league === 'nfl') {
      this.league = 'mlb';
    }
    this.urlToGo = '/' + this.league + '/go/mkf-50/';
  }
}
