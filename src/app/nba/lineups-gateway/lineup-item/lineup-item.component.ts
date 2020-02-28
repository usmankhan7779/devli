import { Component, Input, OnInit } from '@angular/core';
import { TimeZoneService } from '../../../shared/services/time-zone.service';
import { NbaService } from '../../nba.service';

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
  @Input() draftKingsActionActive = true;
  @Input() fanDuelActionActive = false;

  timeZone = this.timeZoneService.getTimeZoneAbbr();

  constructor(
    private nbaService: NbaService,
    private timeZoneService: TimeZoneService
  ) { }

  ngOnInit() {
  }

  isWinner(teamScore, oppScore) {
    return parseInt(teamScore, 10) > parseInt(oppScore, 10);
  }

  getPlayerPosition(player) {
    if (this.sportActionActive) {
      return player.position;
    }
    if (this.draftKingsActionActive) {
      return player.draftkings_position;
    }
    if (this.fanDuelActionActive) {
      return player.fanduel_position;
    }
  }

  showHalftime(status) {
    return this.nbaService.showHalftime(status);
  }
}
