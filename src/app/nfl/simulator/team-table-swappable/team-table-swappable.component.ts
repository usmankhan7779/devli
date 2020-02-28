
import {of as observableOf,  Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { TeamTableSwappableService } from './team-table-swappable.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-team-table-swappable',
  templateUrl: './team-table-swappable.component.html',
  styleUrls: ['./team-table-swappable.component.scss']
})
export class TeamTableSwappableComponent implements OnInit {
  @Input() teamData: any;
  @Input() teamType: string;

  constructor(
    private commonService: CommonService,
    private teamTableSwappableService: TeamTableSwappableService
  ) { }

  ngOnInit() {
  }

  playerFormatter(item: any) {
    const ratingClass = this.commonService.setRatingClass(item.lineups_rating || 0);
    return `
    <table class="w-100" style="table-layout: fixed">
      <tbody>
        <tr class="text-center">
          <td width="12.4%">
            <button class="btn team-swap-btn">${item.position || ''}</button>
          </td>
          <td width="50%" class="text-left">
            ${item.name || ''} ${this.getPosText(item)}
          </td>
          <td>
            <div class="rating-formatter ${ratingClass}">${item.lineups_rating || ''}</div>
          </td>
          <td>${item.depth || ''}</td>
          <td>${item.offensive_snaps_played || ''}</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  onSwap(event) {
    this.teamTableSwappableService.swapPlayers(this.teamType, event['original'], event['new_player']);
  }

  getPosText(item) {
    switch (item.position) {
      case 'QB': {
        return `(${item.passing_yards || 0} yds, ${item.passing_touchdowns || 0} TD, ${item.interceptions || 0} INT)`;
      }
      case 'RB': {
        return `(${item.rushing_attempts || 0} att, ${item.rushing_yards || 0} yds, ${item.rushing_touchdowns || 0} TD)`;
      }
      case 'WR': {
        return `(${item.receptions || 0} Rec, ${item.receiving_yards || 0} yds, ${item.receiving_touchdowns || 0} TD)`;
      }
      case 'TE': {
        return `(${item.receptions || 0} Rec, ${item.receiving_yards || 0} yds, ${item.receiving_touchdowns || 0} TD)`;
      }
      default: {
        return '';
      }
    }
  }

  searchFunction(data, target, keyword) {
    const filteredList = this.teamData.swaps
      .filter(el => {
        if (target.position !== el.position) {
          return false;
        }
        if (!keyword) {
          return true;
        }
        const name = el.name.toLowerCase().split('.');
        const searchWord = keyword.toLowerCase();
        for (let i = 0; i < name.length; i++) {
          if (name[i].indexOf(searchWord) === 0) {
            return true;
          }
        }
        return false;
      })
      .sort((a, b) => {
        return a.name.toLowerCase().indexOf(keyword.toLowerCase()) > b.name.toLowerCase().indexOf(keyword.toLowerCase()) ? 1 : -1;
      });
    return observableOf(filteredList);
  }
}
