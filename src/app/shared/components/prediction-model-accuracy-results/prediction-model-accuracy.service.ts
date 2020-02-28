
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import { environment } from 'environments/environment';
import { CommonService } from '../../services/common.service';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PredictionModelAccuracyService {

  constructor(
    private http: TransferHttp,
    private commonService: CommonService
  ) { }

  initiallyFetchSimGameBets(league) {
    const endpoint = `${environment.api_url}/${league}/fetch/sim-game-bets`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }

  fetchSimGameBets(league, filters, currentPage, sortBy, sortOrder, year?) {
    let preparedFilters: any;
    if (filters) {
      preparedFilters = this.prepareFilters(filters);
    }
    let params = new HttpParams();
    if (!currentPage) {
      currentPage = 1;
    }
    if (currentPage) {
      params = params.append('page', currentPage.toString());
    }
    if (preparedFilters && preparedFilters.page_size) {
      params = params.append('page_size', preparedFilters.page_size.toString());
      delete preparedFilters.page_size;
    }
    if (sortBy) {
      params = params.append('sort_by', sortBy);
    }
    if (sortOrder) {
      params = params.append('order_by', sortOrder);
    }
    if (year) {
      params = params.append('season', year);
    }
    const options = {
      params: params
    };
    const endpoint = `${environment.api_url}/${league}/fetch/sim-game-bets`;
    return this.http.post(endpoint, preparedFilters, options).pipe(
      map((response: any) => {
        return response;
      }));
  }

  private prepareFilters(filters) {
    const resObj = {};
    resObj['page_size'] = this.commonService.getActiveCheckBoxItems(filters.items_per_page, 'name')[0];
    resObj['probabilities'] = this.commonService.getActiveCheckBoxItems(filters.probabilities, 'id');
    resObj['models'] = this.commonService.getActiveCheckBoxItems(filters.models, 'id');
    resObj['ev_ranges'] = this.commonService.getActiveCheckBoxItems(filters.ev_ranges, 'id');
    resObj['dollar_ranges'] = this.commonService.getActiveCheckBoxItems(filters.dollar_ranges, 'name');
    resObj['result_types'] = this.commonService.getActiveCheckBoxItems(filters.result_types, 'id');
    resObj['bet_types'] = this.commonService.getActiveCheckBoxItems(filters.bet_types, 'id');
    return resObj;
  }
}
