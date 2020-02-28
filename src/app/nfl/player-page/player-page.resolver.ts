
import {of as observableOf,  Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PlayerPageService } from './player-page.service';
import { ServerResponseService } from '../../shared/services/server-response.service';
import { playersRedirectListToStats } from './player-redirect-list';
import * as _ from 'lodash';

@Injectable()
export class PlayerPageResolver implements Resolve<any> {
  private readonly redirectPlayerList = {
    'adarius-glanton': 'adarius-taylor'
  };
  constructor(
    private playerPageService: PlayerPageService,
    private serverResponseService: ServerResponseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.params['name'].indexOf('.js') !== -1 || _.includes(playersRedirectListToStats, route.params['name'])) {
      return this.serverResponseService.redirect(`/nfl/player-stats`);
    }
    if (this.redirectPlayerList[route.params['name']]) {
      return this.serverResponseService.redirect(`/nfl/player-stats/${this.redirectPlayerList[route.params['name']]}`);
    }
    if (route.params['id'] && isNaN(parseInt(route.params['id'], 10))) {
      if (route.params['id'] === 'aaron-bailey') {
        return this.serverResponseService.redirect('/nfl/player-stats/aaron-bailey');
      }
      this.router.navigate(['/404']);
      return observableOf(null);
    }
    return this.playerPageService.getPlayer(route.params['id'] || route.params['name']).pipe(
      catchError(() => {
        if (route.params['name'] && /[,.'"\s]/.test(route.params['name'])) {
          return this.playerPageService.getPlayer(route.params['name'].replace(/[,'"]/g, '').replace(/\s/g, '-')).pipe(catchError(() => {
            return this.serverResponseService.redirect(`/nfl/player-stats`)
          }), map(() => {
            return this.serverResponseService.redirect(
              `/nfl/player-stats/${route.params['name'].replace(/[,'"]/g, '').replace(/\s/g, '-')}`
            )
          }));
        }
        if (!route.params['id'] && route.params['name'] && route.params['name'].indexOf('b') === 0) {
          return this.playerPageService.getPlayer(route.params['name'].substring(1).replace(/[,'"]/g, '')).pipe(catchError(() => {
            return this.serverResponseService.redirect(`/nfl/player-stats`)
          }), map(() => {
            return this.serverResponseService.redirect(`/nfl/player-stats/${route.params['name'].substring(1).replace(/[,'"]/g, '')}`)
          }));
        }
        const redirectUrl = '/nfl/player-stats';
        return this.serverResponseService.redirect(redirectUrl);
      }));
  }
}
