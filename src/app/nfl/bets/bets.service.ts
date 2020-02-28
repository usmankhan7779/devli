
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

import {environment} from 'environments/environment';
import { TransferHttp } from '../../../modules/transfer-http/transfer-http';

@Injectable()
export class BetsService {

  constructor(private http: TransferHttp) {
  }


  nflBets(bet_type?, model?, outcome?, win_prob_max?, win_prob_min?, ev_max?, ev_min?, scale?) {
    // TODO: Add a param for the service function for API query param
    // TODO: HBW: I temporary added "?" to the function params to get function working
    const endpoint = `${environment.api_url}/betting/fetch/nfl`;
    return this.http.get(endpoint).pipe(
      map((response: any) => {
        return response;
      }));
  }
}
