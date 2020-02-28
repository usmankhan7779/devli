import { Injectable } from '@angular/core';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';
import { catchError, map } from 'rxjs/operators';
import { NbaService } from 'app/nba/nba.service';
import { of, throwError, forkJoin } from 'rxjs';
import * as moment from 'moment';
import { LineupsGatewayService } from '../../lineups-gateway/lienups.service';

@Injectable()
export class FantasyProjectionsService {

  readonly colorConfig = {
    pointsPerK: {
      PG: [2.74, 3.21, 3.74, 4.14, 4.66, 5.11, 5.42, 6.04, 6.05],
      SG: [2.64, 2.94, 3.69, 4.15, 4.64, 4.94, 5.73, 6.23, 6.24],
      SF: [2.74, 3.38, 3.96, 4.15, 4.46, 4.79, 5.26, 5.91, 5.92],
      PF: [3.21, 3.54, 3.86, 4.46, 4.79, 5.13, 5.5, 5.69, 5.7],
      C: [3.1, 3.35, 3.68, 4.32, 4.62, 4.96, 5.59, 6.04, 6.05]
    },
    minutes: [36, 32, 28, 25, 23, 20, 17, 12, 11],
    spread: [3, 6, 9, 11, 11.1],
    vegas_total: [95.99, 97.99, 99.99, 101.99, 102.99, 104.99, 109.99, 114.99, 115],
    over_under: [189.99, 194.99, 197.99, 199.99, 204.99, 209.99, 214.99, 219.99, 220],
    theory: [1, 2, 4, 5, 6, 7, 8, 9, 10],
    opponent_position_rank: [5, 7, 10, 13, 15, 19, 22, 25, 26],
    fppm: [0.59, 0.69, 0.79, 0.89, 0.99, 1.09, 1.24, 1.39, 1.40],
    fppg_allowed: {
      PG: [36.99, 38.99, 39.99, 41.99, 42, 44.99, 45.99, 47.99, 48],
      SG: [34.99, 35.99, 36.99, 37.99, 38.99, 39.99, 40.99, 42.99, 43],
      SF: [33.99, 34.99, 35.99, 36.99, 37.99, 38.99, 39.99, 41.99, 42],
      PF: [38.99, 39.99, 40.99, 41.99, 42.99, 44.99, 46.99, 48.99, 49],
      C: [45.99, 46.99, 47.99, 48.99, 49.99, 51.99, 52.99, 54.99, 55]
    },
  };

  constructor(
    private http: TransferHttp,
    private nbaService: NbaService,
    private lineupsGatewayService: LineupsGatewayService
  ) { }

  private getPlayerGameProjectionStatsByDate(expires_after) {
    return this.http.get(`https://nba-api.lineups.com/json/PlayerGameProjectionStatsByDate/${expires_after}`);
  }

  getPlayers(getMinutes = false) {
    const idList: number[] = [];
    const expires_after = moment(new Date()).format('YYYY-MM-DD');
    if (getMinutes) {
      return this.getPlayerGameProjectionStatsByDate(expires_after).pipe(
        catchError(err => {
          return throwError(err);
        }),
        map((mainData: any[]) => {
          if (!mainData) {
            return [];
          }
          return mainData.reduce((filtered: any[], player: any) => {
            if (!player['Minutes']) {
              return filtered;
            }
            filtered.push({
              full_name: player['Name'],
              main_position: player['Position'],
              team: player['Team'],
              opponent: player['Opponent'],
              minutes: player['Minutes'],
              projection: player['FantasyPoints'] || '0',
              draftkings_projection: player['FantasyPointsDraftKings'] || '0',
              fanduel_projection: player['FantasyPointsFanDuel'] || '0',
              draftkings_fppm: player['DraftKings_FPPM'] || '0',
              fanduel_fppm: player['FanDuel_FPPM'] || '0',
              profile_url: `/nba/player-stats/${player['Name'].replace(/[^a-zA-Z ]/g, '').toLowerCase().split(' ').join('-')}`,
              team_lineup_route: this.nbaService.getTeamByKey(player['Team']).lineup_route,
              opp_lineup_route: this.nbaService.getTeamByKey(player['Opponent']).lineup_route
            });
            return filtered;
          }, []);
        })
      )
    }
    return forkJoin([
      this.lineupsGatewayService.getNbaStartingLineupsOdds().pipe(catchError(err => of({}))),
      this.getPlayerGameProjectionStatsByDate(expires_after)
    ]).pipe(
        catchError(err => {
          return throwError(err);
        }),
          map(([oddsData, playersData]) => {
            const res = (<any[]>playersData).reduce((filtered: any[], player: any) => {
              const playerOddsData: any = oddsData[this.nbaService.getLineupsKey(player['Team'])] || {};
              if (idList.indexOf(player['Name']) === -1 &&
                player['FanDuelSalary'] && player['DraftKingsSalary']) {
                let playerObj;
                try {
                  playerObj = {
                    full_name: player['Name'],
                    team: player['Team'],
                    teamAbbr: this.nbaService.getLineupsKey(player['Team']),
                    draftkings_position: player['DraftKingsPosition'].split('/'),
                    draftkings_position_display: player['DraftKingsPosition'],
                    fanduel_position: player['FanDuelPosition'].split('/'),
                    fanduel_position_display: player['FanDuelPosition'],
                    draftkings_projection: player['FantasyPointsDraftKings'] || '0',
                    fanduel_projection: player['FantasyPointsFanDuel'] || '0',
                    draftkings_salary: player['DraftKingsSalary'],
                    fanduel_salary: player['FanDuelSalary'],
                    draftkings_ptsK: player['Draftkings_pts_1K'],
                    fanduel_ptsK: player['Fanduel_pts_1K'],
                    draftkings_fppm: player['DraftKings_FPPM'] || '0',
                    fanduel_fppm: player['FanDuel_FPPM'] || '0',
                    usage_rate_percentage: player['UsageRatePercentage'] || '0',
                    opponent: player['Opponent'],
                    opponent_rank: player['OpponentRank'],
                    opponent_position_rank: player['OpponentPositionRank'] || '0',
                    spread: playerOddsData.spread || null,
                    vegas_total: playerOddsData.total || null,
                    over_under: playerOddsData.over_under || null,
                    minutes: player['Minutes'],
                    points: player['Points'],
                    assists: player['Assists'],
                    rebounds: player['Rebounds'],
                    steals: player['Steals'],
                    blocks: player['BlockedShots'],
                    free_throws: player['FreeThrowsMade'],
                    field_goal_attempts: player['FieldGoalsAttempted'],
                    field_goal_made: player['FieldGoalsMade'],
                    player_efficiency_rating: player['PlayerEfficiencyRating'] || '0',
                    field_goal_percentage: player['FieldGoalsPercentage'] || '0',
                    effective_field_goal_percentage: player['EffectiveFieldGoalsPercentage'] || '0',
                    profile_url: `/nba/player-stats/${player['Name'].replace(/[^a-zA-Z ]/g, '').toLowerCase().split(' ').join('-')}`,
                    team_lineup_route: this.nbaService.getTeamByKey(player['Team']).lineup_route,
                    opp_lineup_route: this.nbaService.getTeamByKey(player['Opponent']).lineup_route
                  };
                } catch (e) {
                  console.error(e);
                  console.log(player);
                }
                if (playerObj) {
                  filtered.push(playerObj);
                  idList.push(player['Name']);
                }
              }
              return filtered;
            }, []);
            const teamsArray = Object.keys(oddsData).sort();
            return {data: res, teams: teamsArray};
          })
        );
  }
}
