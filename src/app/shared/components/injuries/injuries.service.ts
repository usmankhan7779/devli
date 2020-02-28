
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';


import {environment} from 'environments/environment';
import { HttpParams } from '@angular/common/http';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';

@Injectable({
  providedIn: 'root'
})
export class InjuriesService {

  constructor(private http: TransferHttp) {
  }

  getInjuries(mode = 'nfl', page = 1, queryParams: any) {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    if (queryParams) {
      if (queryParams.statuses) {
        params = params.append('statuses', queryParams.statuses.join(',') || 'null');
      }
      if (queryParams.teams) {
        params = params.append('teams', queryParams.teams.join(',') || 'null');
      }
      if (queryParams.positions) {
        params = params.append('positions', queryParams.positions.join(',') || 'null');
      }
      if (queryParams.itemsPerPage) {
        params = params.append('page_size', queryParams.itemsPerPage);
      }
      if (queryParams.isMatchupInjuriesPage) {
        params = params.append('matchup', 'true');
      }
      if (queryParams.player) {
        params = params.append('player', queryParams.player.toLowerCase());
      }
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/${mode}/fetch/injuries`;
    return this.http.get(endpoint, options).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
