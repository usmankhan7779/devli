import { Component, Input, OnInit } from '@angular/core';
import { MatchupsGatewayService } from '../../matchups-gateway/matchups-gateway.service';

@Component({
  selector: 'app-lineup-item',
  templateUrl: './lineup-item.component.html',
  styleUrls: ['./lineup-item.component.scss']
})
export class LineupItemComponent implements OnInit {
  @Input() lineup;
  @Input() lineupsLength;
  @Input() index;
  @Input() showLinks = true;
  @Input() sportActionActive = true;
  @Input() fantasyActionActive = false;
  @Input() draftKingsActionActive = true;
  @Input() fanDuelActionActive = false;
  @Input() yahooActionActive = false;
  constructor(
    private matchupsGatewayService: MatchupsGatewayService
  ) { }

  ngOnInit() {
  }

  isWinner(teamScore, oppScore) {
    return parseInt(teamScore, 10) > parseInt(oppScore, 10);
  }
}
