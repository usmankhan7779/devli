import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class GameDataService {

  constructor(
    private http: HttpClient
  ) { }

  get(gameId: string) {
    const endpoint = `${environment.api_url}/nfl/animation/fetch/display/${gameId}`;
    // const endpoint = `${environment.api_url}/nfl/animation/fetch/display/e69aad06-cef4-11e7-abc4-cec278b6b50a`;
    return this.http.get(endpoint);
  }
}
