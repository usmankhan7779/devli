
import {of as observableOf,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PlayerPageService } from './player-page.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import * as _ from 'lodash';
import { badUrlsredirect, inactiveMlbPlayers, redirectToMLBPageRouteList, RedirectObj } from './player-redirect-list';



@Injectable()
export class PlayerPageResolver implements Resolve<any> {
  constructor(
    private playerPageService: PlayerPageService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const redirectPlayerObj: RedirectObj = <RedirectObj>_.find(badUrlsredirect, {url: route.params['name']});
    if (redirectPlayerObj) {
      const redirectUrl = `/mlb/player-stats/${redirectPlayerObj.redirectUrl}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (route.params['name'] && _.includes(redirectToMLBPageRouteList, route.params['name'])) {
      return this.serverResponseService.redirect('/mlb');
    }
    if (route.params['name'] && _.includes(inactiveMlbPlayers, route.params['name'])) {
      return this.serverResponseService.redirect('/mlb/player-stats');
    }
    if (route.params['id'] && isNaN(parseInt(route.params['id'], 10))) {
      this.router.navigate(['/404']);
      return observableOf(null);
    }
    return this.playerPageService.getPlayer(route.params['id'] || route.params['name']).pipe(
      catchError(() => {
        const redirectUrl = `/mlb/player-stats`;
        return this.serverResponseService.redirect(redirectUrl);
      }));
  }
}
