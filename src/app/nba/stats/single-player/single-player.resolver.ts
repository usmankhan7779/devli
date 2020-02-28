
import {of as observableOf,  Observable, forkJoin } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SinglePlayerService } from './single-player.service';
import { ServerResponseService } from '../../../shared/services/server-response.service';
import {
  playersToRedirect, playersToRedirectToMLB, playerObjToRedirect,
  inactiveNBAPlayers
} from './redirect-player-list';
import * as _ from 'lodash';
import { RedirectObj } from '../../../mlb/player-page/player-redirect-list';
import { WPService } from '../../../shared/components/wordpress/WP.service';

@Injectable()
export class SinglePlayerResolver implements Resolve<any> {
  constructor(
    private singlePlayerService: SinglePlayerService,
    private serverResponseService: ServerResponseService,
    private wpService: WPService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (route.params['name'] && _.includes(inactiveNBAPlayers, route.params['name'])) {
      const redirectUrl = '/nba/player-stats';
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (route.params['name'] && _.includes(playersToRedirectToMLB, route.params['name'])) {
      const redirectUrl = `/mlb/player-stats/${route.params['name'].replace(/[,'"]/g, '')}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (route.params['name'] && _.includes(playersToRedirect, route.params['name']) || route.params['id'] === 'undefined') {
      const redirectUrl = `/nba/player-stats/${route.params['name'].replace(/[,'"]/g, '')}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    const redirectPlayerObj: RedirectObj = <RedirectObj>_.find(playerObjToRedirect, {url: route.params['name']});
    if (route.params['name'] && redirectPlayerObj) {
      const redirectUrl = `/nba/player-stats/${redirectPlayerObj.redirectUrl}`;
      return this.serverResponseService.redirect(redirectUrl);
    }
    if (route.params['id'] && isNaN(parseInt(route.params['id'], 10))) {
      this.router.navigate(['/404']);
      return observableOf(null);
    }
    const articlesCall = this.getArticles(route.params['name']);
    const bettingArticlesCall = this.getBettingArticles(route.params['name']);
    const playerCall = this.singlePlayerService.getPlayer(route.params['id'] || route.params['name']).pipe(
      catchError(() => {
        if (!route.params['id'] && route.params['name'] && route.params['name'].indexOf('b') === 0) {
          return this.singlePlayerService.getPlayer(route.params['name'].substring(1).replace(/[,'"]/g, '')).pipe(catchError(() => {
            return this.serverResponseService.redirect(`/nba/player-stats`)
          }), map(() => {
            return this.serverResponseService.redirect(`/nba/player-stats/${route.params['name'].substring(1).replace(/[,'"]/g, '')}`)
          }));
        }
        // this.router.navigate(['/404']);
        // return observableOf(null);
        const redirectUrl = '/nba/player-stats';
        return this.serverResponseService.redirect(redirectUrl);
      }));
    return forkJoin([playerCall, articlesCall, bettingArticlesCall]).pipe(
      map((res) => {
        return {
          playerData: res[0],
          articles: [...res[2], ...res[1]]
        }
      })
    );
  }

  private getArticles(name) {
    const tagId = this.singlePlayerService.getPlayerArticlesId(name.split('-').join(' '));
    if (!tagId) {
      return observableOf([]);
    }
    return this.wpService.searchPosts('', 4, 'articles', [], [tagId])
      .pipe(
        catchError((err) => {
          return observableOf([]);
        })
      )
  }

  private getBettingArticles(name) {
    const tagId = this.singlePlayerService.getPlayerBettingArticlesId(name.split('-').join(' '));
    if (!tagId) {
      return observableOf([]);
    }
    return this.wpService.searchPosts('', 4, 'betting', [], [tagId], true)
      .pipe(
        catchError((err) => {
          return observableOf([]);
        })
      )
  }
}
