import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {
  private savedView: string;
  private savedTeamData: any;
  viewHasBeenChanged = new Subject<string>();
  watchGameWasClicked = new Subject<string>();

  readonly availableViews = ['game', 'results'];
  constructor(
    private http: TransferHttp
  ) { }

  watchGameRequest(data, playersData) {
    const gameObj = {
      weather: data.general.weather.name,
      away_team: data.away.teams.id,
      away_team_season: data.away.seasons.name,
      home_team: data.home.teams.id,
      home_team_season: data.home.seasons.name,
      away_players: this.preparePlayers(playersData.away.players),
      home_players: this.preparePlayers(playersData.home.players),
    };
    const endpoint = `${environment.api_url}/nfl/animation/create`;
    return this.http.post(endpoint, gameObj);
  }

  private preparePlayers(players) {
    return {
      qb: players[0].player_id,
      rb1: players[1].player_id,
      rb2: players[2].player_id,
      wr1: players[3].player_id,
      wr2: players[4].player_id,
      wr3: players[5].player_id,
      te: players[6].player_id,
      def: players[7].player_id,
    }
  }

  getDropdownValues() {
    const endpoint = `${environment.api_url}/nfl/fetch/nfl-animation/header`;
    return this.http.get(endpoint);
  }

  getSimulation(team1, season1, team2, season2) {
    const endpoint = `${environment.api_url}/nfl/fetch/nfl-animation/teams/${team2}/${season2}/${team1}/${season1}`;
    return this.http.get(endpoint);
  }

  getBoxScore(team1, season1, team2, season2) {
    const endpoint = `${environment.api_url}/nfl/fetch/nfl-animation/box-score/${team2}/${season2}/${team1}/${season1}`;
    return this.http.get(endpoint);
  }

  onViewChange(view) {
    this.viewHasBeenChanged.next(view);
  }


  onViewPreselect(view) {
    this.savedView = view;
  }

  onTeamPreselect(obj) {
    this.savedTeamData = obj;
  }

  removePreselectedView() {
    this.savedView = null;
  }

  removePreselectedTeamData() {
    this.savedTeamData = null;
  }

  getPreselectedView() {
    return this.savedView;
  }

  getPreselectedTeamData() {
    return this.savedTeamData;
  }

  onWatchGameClick() {
    this.watchGameWasClicked.next();
  }

}
