
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from '../../environments/environment';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollegeFootballService {
  preSelectedSeason = null;
  private seasons: any[];
  constructor(
    private http: TransferHttp
  ) { }

  getPreSelectedSeason() {
    return this.preSelectedSeason;
  }

  setPreSelectedSeason(year: number | string) {
    this.preSelectedSeason = parseInt((<string>year), 10);
  }

  removePreSelectedSeason() {
    this.preSelectedSeason = null;
  }

  getDefaultSeason(seasons: any[], prop = 'year') {
    if (!this.seasons) {
      this.seasons = seasons;
    }
    return _.find(seasons, 'default')[prop];
  }

  checkAvailableSeason(season: string | number, seasons: any[]) {
    if (season && seasons) {
      return _.includes(seasons.map(seasonObj => seasonObj.year + ''), season + '');
    }
    return false;
  }

  checkIfDefaultSeason(season, seasons, tryToGetWithoutApi = false, prop?) {
    let _seasons = seasons;
    if (tryToGetWithoutApi) {
      if (this.seasons && this.seasons.length) {
        _seasons = this.seasons;
      } else {
        return true;
      }
    }
    return `${season}` === `${this.getDefaultSeason(_seasons, prop)}`
  }

  getGatewayData(year?) {
    let yearUrl = '';
    if (year) {
      yearUrl = `/${year}`
    }
    const endpoint = `${environment.api_url}/cfb/fetch/gateway${yearUrl}`;
    return this.http.get(endpoint).pipe(
      map((res: any) => {
        return res;
      }));
  }
}
