
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';


import {environment} from 'environments/environment';
import {LibraryService} from '../../shared/helpers/library.service';
import {Parameter} from '../../shared/models/parameter';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';

@Injectable()
export class BetMetricsService {

  constructor(private http: TransferHttp) {
  }

  /**
   *  MLB Bet Metrics - mlbBetMetrics
   *  -----------------------------------------
   *  @query-param team
   *  @returns Observable<R>
   *  Make a GET call to the /mlb/fetch/bet_metrics?bunchofstuff
   *  date is optional. If left blank, returns current day
   *  API endpoint and return the extracted response data.
   */
  mlbBetMetrics(parameters: Parameter[]) {

    // TODO: Add a param for the service function for API query param
    const parametersString = LibraryService.prepareParametersString(parameters);
    const endpoint = `${environment.api_url}/mlb/bet_metrics${parametersString}`;
    // const endpoint = 'https://api.myjson.com/bins/ix79t';
    return this.http.get(endpoint).pipe(
    map((response: any) => {
      return response;
    }));
  }
}
