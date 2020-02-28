
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {map} from 'rxjs/operators';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';
import { CommonService } from '../../shared/services/common.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class TeamSnapCountsService {
  private preSelectedTeamSeason: number;

  constructor(
    private http: TransferHttp,
    private commonService: CommonService,
  ) { }

  getTeamSnapCounts(name: string, year, queryParams?) {
    let params = new HttpParams();
    if (queryParams) {
      if (queryParams.season_type) {
        params = params.append('season_type', queryParams.season_type.toString());
      }
    }
    const options = {
      params: params
    };
    let _year;
    if (year && isNaN(parseInt(year, 10))) {
      return observableThrowError('year should be integer');
    } else if (!year) {
      _year = 'current';
    } else {
      _year = year;
    }
    const endpoint = `${environment.api_url}/nfl/fetch/snaps/team/${_year}/${name.replace('-snap-counts', '')}`;
    return this.http.get(endpoint, options).pipe(
      map(res => {
        this.commonService.sortYearArr(res.seasons_dropdown);
        return res;
      }));
  }

  getDDdObject(seasonTypeDropdownArg) {
    const seasonTypeDropdown = this.commonService.prepareDDItems(seasonTypeDropdownArg, false, false);
    (<any>_.find(seasonTypeDropdown, {name: 'Regular'})).selected = true;
    const activeSeasonType = (<any>_.find(seasonTypeDropdown, 'selected')).id;
    return {
      seasonTypeDropdown,
      activeSeasonType,
      tabs: {
        offense: true,
        qb: false,
        rb: false,
        wr: false,
        te: false,
        k: false,
        ol: false,
        def: false
      }
    };
  }

  getPreSelectedTeamSeason() {
    return this.preSelectedTeamSeason;
  }

  setPreSelectedTeamSeason(year: number | string) {
    this.preSelectedTeamSeason = parseInt((<string>year), 10);
  }

  removePreSelectedTeamSeason() {
    this.preSelectedTeamSeason = null;
  }

}
