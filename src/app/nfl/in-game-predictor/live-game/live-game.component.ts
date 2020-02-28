import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-game',
  templateUrl: './live-game.component.html',
  styleUrls: ['./live-game.component.scss']
})
export class LiveGameComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

  getValueDependOnDash(valueToCheck, postfix, valueToGet = valueToCheck) {
    if (valueToCheck === '-') {
      return '-';
    }
    return valueToGet + postfix;
  }

}
