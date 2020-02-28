import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stats-leader-list',
  templateUrl: './stats-leader-list.component.html',
  styleUrls: ['./stats-leader-list.component.scss']
})
export class StatsLeaderListComponent implements OnInit {
  @Input() league: string;
  @Input() leadersData: any;
  @Input() cardHeader: string;
  @Input() isTeamLeaderList = false;
  @Input() propStat: string;
  @Output() onViewMoreClick = new EventEmitter();
  @Output() teamWasClicked = new EventEmitter();
  constructor(
  ) { }

  ngOnInit() {
  }

  setSortOrderAndNavigate() {
    this.onViewMoreClick.emit({
      sort_stat: this.leadersData.sort_stat,
      stat_url: this.leadersData.stat_url
    });
  }

  onTeamClick() {
    this.teamWasClicked.emit();
  }

  showSmHeaderName(header) {
    if (header === 'Field Goals Made') {
      return 'FGM';
    }
    if (header) {
      return header.split(' ').map(word => this.handleShortHeader(word)).join(' ');
    }
    return header;
  }

  private handleShortHeader(word) {
    if (!word || !word.trim()) {
      return word;
    }
    switch (word.trim()) {
      case 'Touchdowns': {
        return 'TD';
      }
      case 'Attempts': {
        if (this.league !== 'nba') {
          return 'ATT';
        }
        return word;
      }
      case 'Yards': {
        return 'YDS';
      }
      case 'Points': {
        return 'Pts';
      }
      case 'Return': {
        return 'Ret';
      }
      case 'Average': {
        return 'Avg';
      }
      case 'Turnovers': {
        return 'TOV';
      }
      case 'Game': {
        return 'GM';
      }
      case 'Offensive': {
        return 'OFF';
      }
      case 'Defensive': {
        return 'DEF';
      }
      default: {
        return word;
      }
    }
  }

  teamStatsLink(leader) {
    if (this.league === 'nfl') {
      return leader.team_stats_route || '';
    }
    return leader.team_stats_route || leader.team_lineup_route || '';
  }

}
