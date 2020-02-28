import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbaService } from '../../../nba/nba.service';

@Component({
  selector: 'app-matchup-heading',
  templateUrl: './matchup-heading.component.html',
  styleUrls: ['./matchup-heading.component.scss']
})
export class MatchupHeadingComponent implements OnInit {
  @Input() awayTeamUrl: string;
  @Input() homeTeamUrl: string;
  @Input() homeTeamName: string;
  @Input() homeTeamDetails: string;
  @Input() homeTeamLogoSrc: string;
  @Input() awayTeamName: string;
  @Input() awayTeamDetails: string;
  @Input() awayTeamLogoSrc: string;
  @Input() stadium: string;
  @Input() align: string;
  @Input() mobileView = false;
  @Input() isBorderedLogos = true;
  @Input() league;
  @Input() date;
  @Input() updated;
  @Input() allowShortNames = false;
  @Input() status;
  @Input() homeTeamShort;
  @Input() awayTeamShort;
  @Input() additionalInfo: any;
  @Input() hideStatus = false;

  @Output() teamWasClicked = new EventEmitter();

  constructor(
    private nbaService: NbaService
  ) { }

  ngOnInit() {
  }

  isWinner(teamScore, oppScore) {
    return parseInt(teamScore, 10) > parseInt(oppScore, 10);
  }

  showHalftime(status) {
    return this.nbaService.showHalftime(status);
  }

  onTeamLinkClick() {
    this.teamWasClicked.emit();
  }

}
