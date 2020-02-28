import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Subject } from 'rxjs';

@Injectable()
export class NavbarService {
  navbarViewUpdated = new Subject<any>();

  constructor(
    private http: TransferHttp
  ) { }

  isLiveGamePresent() {
    const endpoint = `${environment.api_url}/nfl/fetch/games/live`;
    return this.http.get(endpoint)
  }

  removeNavbar() {
    this.navbarViewUpdated.next(false);
  }

  showNavbar() {
    this.navbarViewUpdated.next(true);
  }
}
