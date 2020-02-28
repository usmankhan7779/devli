
import {throwError as observableThrowError, forkJoin as observableForkJoin, of as observableOf, Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { TransferHttp } from '../../../../modules/transfer-http/transfer-http';
import { WpSmBlogItemModel } from './models/wp-sm-blog-item.model';
import * as _ from 'lodash';
import {
  MLBArticlesTagMap, NBAArticlesTagMap, NBABettingArticlesTagMap, NBAPodcastsTagMap,
  NFLArticlesTagMap
} from './team-tag-map';
@Injectable({
  providedIn: 'root'
})
export class WPService {

  constructor(
    private http: TransferHttp
  ) { }

  getTeamArticles(name: string, getPodcasts: boolean, league: 'mlb' | 'nba' | 'nfl'): Observable<any> {
    let articlesTagMap;
    const leagueCategory = this.getLeagueArticlesCategory(league);
    if (league === 'nfl') {
      articlesTagMap = NFLArticlesTagMap;
    } else if (league === 'nba') {
      articlesTagMap = NBAArticlesTagMap;
    } else if (league === 'mlb') {
      articlesTagMap = MLBArticlesTagMap;
    } else {
      return observableOf([]);
    }

    let apiCall;
    let podcastsCall;
    let bettingCall;
    const todayMatchupCall = this.getMatchupArticle(league, name, '', '', true)
      .pipe(catchError(err => observableOf(null)));

    const excludeArticlesMatchupCats = this.getMatchupCategory(league) ? [this.getMatchupCategory(league)] : [];
    const articlesCall = this.searchPosts('', 4, 'articles', [leagueCategory], [articlesTagMap[name]], false, excludeArticlesMatchupCats)
      .pipe(catchError(err => observableOf([])));

    if (getPodcasts && league === 'nba') {
      podcastsCall = this.searchPosts('', 2, 'podcasts', [], [NBAPodcastsTagMap[name]])
        .pipe(catchError(err => observableOf([])));
      bettingCall = this.searchPosts('', 2, 'betting', [], [NBABettingArticlesTagMap[name]], true)
        .pipe(catchError(err => observableOf([])));
      apiCall = observableForkJoin([articlesCall, podcastsCall, bettingCall, todayMatchupCall])
    } else {
      apiCall = observableForkJoin([articlesCall, todayMatchupCall])
    }
    return apiCall
      .pipe(
        catchError(err => {
          return observableThrowError(err);
        }),
        map(((response) => {
          let res;
          const articles = response[0];
          let podcasts;
          let betting;
          let todayMatchup;
          if (getPodcasts) {
            podcasts = response[1];
            betting = response[2];
            todayMatchup = response[3] ? [response[3]] : [];
            res = _.concat(betting, articles, podcasts, todayMatchup);
            this.sortByDate(res);
            return res;
          }
          todayMatchup = response[1] ? [response[1]] : [];
          res = _.concat(articles, todayMatchup);
          this.sortByDate(res);
          return res;
        }))
      )
  }

  getTeamPagesAndArticles(name: string, league: 'mlb' | 'nba' | 'nfl', getPodcasts = false): Observable<any> {
    let articlesTagMap;
    let podcastsTagMap;
    let bettingTagMap;
    let articlesCall;
    let bettingCall;
    let podcastsCall;
    const leagueCategory = this.getLeagueArticlesCategory(league);
    if (league === 'nfl') {
      articlesTagMap = NFLArticlesTagMap;
    } else if (league === 'nba') {
      articlesTagMap = NBAArticlesTagMap;
      podcastsTagMap = NBAPodcastsTagMap;
      bettingTagMap = NBABettingArticlesTagMap;
    } else if (league === 'mlb') {
      articlesTagMap = MLBArticlesTagMap;
    } else {
      return observableOf([]);
    }
    let excludeArticlesMatchupCats = [];
    if (league !== 'mlb' && league !== 'nba') {
      excludeArticlesMatchupCats = this.getMatchupCategory(league) ? [this.getMatchupCategory(league)] : [];
    }

    // tslint:disable-next-line:max-line-length
    articlesCall = this.searchPosts('', 5, 'articles', [leagueCategory], [articlesTagMap[name]], false, excludeArticlesMatchupCats, 'any-post-type')
      .pipe(catchError(err => observableOf([])));

    if (getPodcasts && league === 'nba') {
      podcastsCall = this.searchPosts('', 2, 'podcasts', [], [podcastsTagMap[name]], false, [], 'any-post-type')
        .pipe(catchError(err => observableOf([])));
      bettingCall = this.searchPosts('', 2, 'betting', [], [bettingTagMap[name]], true, [], 'any-post-type')
        .pipe(catchError(err => observableOf([])));
      articlesCall = observableForkJoin([articlesCall, podcastsCall, bettingCall]);
    }


    return articlesCall
      .pipe(
        map(((response) => {
          const withPodcasts = getPodcasts && league === 'nba';
          let res;
          const articles = withPodcasts ? response[0] : response;
          let podcasts;
          let betting;
          if (withPodcasts) {
            podcasts = response[1];
            betting = response[2];
            res = _.concat(betting, articles, podcasts);
            this.sortByDate(res);
            return res;
          }
          this.sortByDate(articles);
          return articles;
        }))
      )
  }

  searchPosts(search, perPage, postType = 'articles', categories = [], tags = [], todayOnly = false, excludeCats = [],
              postTypeInner = 'posts') {
    let params = new HttpParams();
    if (perPage && postTypeInner === 'any-post-type') {
      params = params.append('posts_per_page', perPage);
    } else if (perPage) {
      params = params.append('per_page', perPage);
    }
    if (search) {
      params = params.append('search', search);
    }
    if (tags && tags.length) {
      const notEmptyTags = tags.filter(tag => !!tag);
      if (notEmptyTags.length) {
        params = params.append('tags', notEmptyTags.join(','));
      }
    }
    if (categories && categories.length) {
      params = params.append('categories', categories.join(','));
    }
    if (excludeCats && excludeCats.length) {
      params = params.append('categories_exclude', excludeCats.join(','));
    }
    if (todayOnly) {
      const today = this.getTodayObject();
      params = params.append('after', `${today.yyyy}-${today.mm}-${today.dd}T00:00:00.000Z`);
      params = params.append('before', `${today.yyyy}-${today.mm}-${today.dd}T23:59:59.999Z`);
    }
    const endpoint = `https://www.lineups.com/${postType}/wp-json/wp/v2/${postTypeInner}`;
    return this.http.get(endpoint, { params: params }).pipe(
      map(res => {
        return this.prepareWParticles(res);
      }));
  }

  prepareWParticles(articles: Array<WpSmBlogItemModel>): Array<WpSmBlogItemModel> {
    if (!articles || !articles.length) {
      return [];
    }
    const preparedaArticles = articles.map((item: any) => {
      return <WpSmBlogItemModel>{
        title: item.title.rendered,
        content: item.content.rendered,
        fullArticleUrl: item.link,
        modified: item.modified,
        author: {
          name: item.author_name,
          link: item.author_url
        },
        imageUrl: item.featured_media_url
      };
    });
    this.sortByDate(preparedaArticles);
    return preparedaArticles;
  }

  getMatchupArticle(league: 'mlb' | 'nba' | 'nfl', homeTeam: string, awayTeam: string, date: string, isToday = false) {
    let articlesTagMap;
    if (league === 'nfl') {
      articlesTagMap = NFLArticlesTagMap;
    } else if (league === 'nba') {
      articlesTagMap = NBAArticlesTagMap;
    } else if (league === 'mlb') {
      articlesTagMap = MLBArticlesTagMap;
    }
    const leagueCategory = this.getLeagueArticlesCategory(league);
    let params = new HttpParams();
    if (isToday) {
      const today = this.getTodayObject();
      params = params.append('after', `${today.yyyy}-${today.mm}-${today.dd}T00:00:00.000Z`);
      params = params.append('before', `${today.yyyy}-${today.mm}-${today.dd}T23:59:59.999Z`);
    } else if (date) {
      const dateArr = date.split('/');
      const year = dateArr[2];
      const month = dateArr[0];
      const day = dateArr[1];
      params = params.append('after', `20${year}-${month}-${day}T00:00:00.000Z`);
      params = params.append('before', `20${year}-${month}-${day}T23:59:59.999Z`);
    }

    params = params.append('per_page', '1');
    params = params.append('categories', [this.getMatchupCategory(league)].join(','));
    if (articlesTagMap[homeTeam] || articlesTagMap[awayTeam]) {
      const teamTags = [articlesTagMap[homeTeam], articlesTagMap[awayTeam]].filter((tag) => !!tag);
      params = params.append('tags', teamTags.join(','));
    }
    const endpoint = `https://www.lineups.com/articles/wp-json/wp/v2/posts`;
    return this.http.get(endpoint, { params: params }).pipe(
      map(res => {
        return this.prepareWParticles(res)[0];
      }));
  }

  getLeagueArticlesCategory(league: 'mlb' | 'nba' | 'nfl') {
    switch (league.toLowerCase()) {
      case 'nba': {
        return '8';
      }
      case 'nfl': {
        return '4';
      }
      case 'mlb': {
        return '3';
      }
    }
    return null;
  }
  private getMatchupCategory(league: 'mlb' | 'nba' | 'nfl') {
    switch (league.toLowerCase()) {
      case 'nba': {
        return '53';
      }
      case 'nfl': {
        return '149';
      }
      case 'mlb': {
        return '216';
      }
    }
    return null;
  }

  private getTodayObject(): {dd: string, mm: string, yyyy: string} {
    const today = new Date();
    let day: any = today.getDate();
    let month: any = today.getMonth() + 1;
    const year = today.getFullYear();
    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return {
      dd: day,
      mm: month,
      yyyy: year.toString()
    }
  }

  sortByDate(posts) {
    posts.sort((a, b) => {
      return new Date(b.modified).getTime() - new Date(a.modified).getTime();
    });
  }
}
