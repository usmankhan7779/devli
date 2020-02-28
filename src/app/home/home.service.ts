
import { of as observableOf, Observable, of } from 'rxjs';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';


import { environment } from 'environments/environment';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { NbaService } from '../nba/nba.service';
import { HttpParams , HttpHeaders, HttpClient} from '@angular/common/http';
import { WPService } from '../shared/components/wordpress/WP.service';

@Injectable()
export class HomeService {
  constructor(
    private http: TransferHttp,
    private httpClient: HttpClient,
    private wpService: WPService,
    private nbaService: NbaService,
  ) { }

  getHomePageInfo(mode: string) { // mode: nfl / mlb / nba
    if (mode === 'nba' && this.nbaService.forceOffseason) {
      return observableOf([]);
    }
    const endpoint = `${environment.api_url}/${mode}/fetch/homepage`;
    return this.http.get(endpoint);
  }

  getBets() {
    const endpoint = `${environment.api_url}/nfl/fetch/homepage/bets`;
    return this.http.get(endpoint).pipe(
      map(res => {
        res.table_rows = [
          [
            {
              'dollar_signs': 5,
              'dollar_hex': '#2bb673'
            },
            2,
            100,
            165,
            149,
            90.91,
            'nfl/prediction-model-accuracy'
          ],
          [
            {
              'dollar_signs': 4,
              'dollar_hex': '#79d25e'
            },
            8,
            50,
            269,
            -5.49,
            -2.04,
            'nfl/prediction-model-accuracy'
          ],
          [
            {
              'dollar_signs': 3,
              'dollar_hex': '#e3b720'
            },
            115,
            60,
            2753,
            540.94,
            19.65,
            'nfl/prediction-model-accuracy'
          ],
          [
            {
              'dollar_signs': 2,
              'dollar_hex': '#f4dd1c'
            },
            488,
            49,
            6969,
            421.11,
            6.05,
            'nfl/prediction-model-accuracy'
          ],
          [
            {
              'dollar_signs': 1,
              'dollar_hex': '#e14747'
            },
            516,
            43,
            286,
            221,
            -10.97,
            'nfl/prediction-model-accuracy'
          ],
          [
            {
              'dollar_signs': 1,
              'dollar_hex': '#e14747'
            },
            1129,
            47,
            1287,
            808.53,
            6.28,
            'nfl/prediction-model-accuracy'
          ]
        ];
        return res;
      }));
  }

  getSelectedLeague() {
    return 'nfl';
  }



  getWpArticles(postType = 'posts', articlesUrl = 'articles', perPage = '4') {

    let params = new HttpParams();
    let headers: HttpHeaders = new HttpHeaders();
    params = params.append(postType === 'any-post-type' ? 'posts_per_page' : 'per_page', perPage);
    params = params.append('updatedcache', 'true');
    //const options = { params: params, headers: headers };
    headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('Accept', 'application/json');
    const endpoint = `https://www.lineups.com/${articlesUrl}/wp-json/wp/v2/${postType}`;
    return this.http.get(endpoint,{params: params, headers: headers}).pipe(
      map(res => {
        return this.wpService.prepareWParticles(res);
      }));
  }

}
