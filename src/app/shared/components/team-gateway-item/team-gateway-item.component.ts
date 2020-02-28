import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-team-gateway-item',
  templateUrl: './team-gateway-item.component.html',
  styleUrls: ['./team-gateway-item.component.scss']
})
export class TeamGatewayItemComponent {
  @Input() league: 'nfl' | 'nba' | 'mlb';
  @Input() team: any;
  @Input() showTeamShortName: boolean;
  @Output() urlClicked = new EventEmitter();

  constructor(
  ) { }

  onUrlClick(type?) {
    this.urlClicked.emit(type);
  }
}
