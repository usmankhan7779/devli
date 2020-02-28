
import {forkJoin as observableForkJoin, of as observableOf } from 'rxjs';

import {map, catchError} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset, NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from './home.service';
import { WpSmBlogItemModel } from '../shared/components/wordpress/models/wp-sm-blog-item.model';
import { ScoreBarHelperService } from '../score-bar/score-bar-helper.service';
import { WPService } from '../shared/components/wordpress/WP.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('tabset', {static: false}) private tabs: NgbTabset;
  mlbLineups: any;
  nflLineups: any;
  nbaLineups: any;
  showNFLTab = false;
  showNBATab = false;
  showMLBTab = false;
  betsData: any;
  articles: Array<WpSmBlogItemModel>;
  bettingArticles: Array<WpSmBlogItemModel>;
  podcastsArticles: Array<WpSmBlogItemModel>;
  showedItemsNumber = 4;
  constructor(
    config: NgbTabsetConfig,
    private homeService: HomeService,
    private wpService: WPService,
    private scoreBarService: ScoreBarHelperService
  ) {
    // customize default values of tabsets used by this component tree
    config.justify = 'center';
  }

  ngOnInit() {
    this.handleLineups();
    this.handleBets();
    this.getArticles();
  }

  private handleBets() {
    this.homeService.getBets()
      .subscribe((res) => {
        this.betsData = res;
        this.divideBottomParagraph();
      })
  }

  private divideBottomParagraph() {
    try {
      const firstSectionParagraphs = {
        first: {
          start: this.getPosition(this.betsData.bottom_paragraph, '<p>', 1, false),
          end:   this.getPosition(this.betsData.bottom_paragraph, '</p>', 1)
        },
        second: {
          start: this.getPosition(this.betsData.bottom_paragraph, '<p>', 2, false),
          end:   this.getPosition(this.betsData.bottom_paragraph, '</p>', 2)
        },
        third: {
          start: this.getPosition(this.betsData.bottom_paragraph, '<p>', 3, false),
          end:   this.getPosition(this.betsData.bottom_paragraph, '</p>', 3)
        },
        fourth: {
          start: this.getPosition(this.betsData.bottom_paragraph, '<p>', 4, false),
          end:   this.getPosition(this.betsData.bottom_paragraph, '</p>', 4)
        },
      };
      this.betsData.bottomParagraphfirstSectionParagraphs = [
        this.betsData.bottom_paragraph.substring(firstSectionParagraphs.first.start, firstSectionParagraphs.first.end),
        this.betsData.bottom_paragraph.substring(firstSectionParagraphs.second.start, firstSectionParagraphs.second.end),
        this.betsData.bottom_paragraph.substring(firstSectionParagraphs.third.start, firstSectionParagraphs.third.end),
        this.betsData.bottom_paragraph.substring(firstSectionParagraphs.fourth.start, firstSectionParagraphs.fourth.end)
      ];
      const dividePosition = this.getPosition(this.betsData.bottom_paragraph, '</p>', 4);
      this.betsData.bottomParagraphFirstParagraphs = this.betsData.bottom_paragraph.substr(0, dividePosition);
      let bottomParagraphRestParagraphs = this.betsData.bottom_paragraph.substring(dividePosition + 1);
      const secondHeadingPosition = this.getPosition(bottomParagraphRestParagraphs, '</center>', 1);
      const thirdHeadingPositionStart = this.getPosition(bottomParagraphRestParagraphs, '<center>', 2, false);
      this.betsData.secondHeading = bottomParagraphRestParagraphs.substr(0, secondHeadingPosition);
      this.betsData.secondParagraphs = bottomParagraphRestParagraphs.substring(secondHeadingPosition,
        thirdHeadingPositionStart);
      bottomParagraphRestParagraphs = bottomParagraphRestParagraphs.substring(thirdHeadingPositionStart);

      const thirdHeadingPosition = this.getPosition(bottomParagraphRestParagraphs, '</center>', 1);
      const fourthHeadingPositionStart = this.getPosition(bottomParagraphRestParagraphs, '<center>', 2, false);
      this.betsData.thirdHeading = bottomParagraphRestParagraphs.substr(0, thirdHeadingPosition);
      this.betsData.thirdParagraphs = bottomParagraphRestParagraphs.substring(thirdHeadingPosition,
        fourthHeadingPositionStart);
      bottomParagraphRestParagraphs = bottomParagraphRestParagraphs.substring(fourthHeadingPositionStart);
      this.betsData.bottomParagraphRestParagraphs = bottomParagraphRestParagraphs;
    } catch (e) {
      console.error('ERROR: occured while splitting this.betsData.bottom_paragraph on HP');
    }
  }

  private getPosition(string, subString, index, addSubStringLenght = true) {
    const res = string.split(subString, index).join(subString).length;
    if (addSubStringLenght) {
      return res + subString.length;
    }
    return res;
  }

  onTabChange(tab) {
    const selectedLeague = tab.nextId.replace(/tab-/, '');
    this.scoreBarService.changeScorebarLeague(selectedLeague);
  }

  private handleLineups() {
    // const getMLBHPInfo = this.homeService.getHomePageInfo('mlb').pipe(map(res => res), catchError(err => observableOf([])));
    // const getNFLHPInfo = this.homeService.getHomePageInfo('nfl').pipe(map(res => res), catchError(err => observableOf([])));
    const getMLBHPInfo = observableOf([]);
    const getNFLHPInfo = observableOf([]);
    const getNBAHPInfo = this.homeService.getHomePageInfo('nba').pipe(map(res => res), catchError(err => observableOf([])));
    observableForkJoin([getNBAHPInfo, getMLBHPInfo, getNFLHPInfo])
      .subscribe(([NBAHPInfo, MLBHPInfo, NFLHPInfo]) => {
        this.mlbLineups = MLBHPInfo;
        this.nflLineups = NFLHPInfo;
        this.nbaLineups = NBAHPInfo;
        if (this.nbaLineups && this.nbaLineups.length > 0) {
          this.showNBATab = true;
          if (!this.nflLineups || this.nflLineups.length === 0) {
            this.setTab('nba');
          }
        } else {
          this.showNBATab = false;
        }
        if (this.mlbLineups && this.mlbLineups.length > 0) {
          this.showMLBTab = true;
          if (!this.nbaLineups || this.nbaLineups.length === 0) {
            this.setTab('mlb');
          }
        } else {
          this.showMLBTab = false;
        }
        if (this.nflLineups && this.nflLineups.length > 0) {
          this.showNFLTab = true;
          this.setTab('nfl');
        } else {
          this.showNFLTab = false;
        }

        const selectedLeague = this.homeService.getSelectedLeague();
        if (selectedLeague && this[selectedLeague + 'Lineups'] && this[selectedLeague + 'Lineups'].length) {
          this.setTab(selectedLeague, true);
        }
      });
  }

  private setTab(selectedLeague, preselect = false, immediate = false) {
    if ((this.homeService.getSelectedLeague() && !preselect) || !this.tabs) {
      return;
    }
    if (immediate) {
      this.tabs.select(`tab-${selectedLeague}`);
    } else {
      this.tabs.activeId = `tab-${selectedLeague}`;
    }
    this.scoreBarService.changeScorebarLeague(selectedLeague);
  }

  private getArticles() {
    this.homeService.getWpArticles('any-post-type').pipe(map(res => res), catchError(err => observableOf([])))
      .subscribe((res) => {
        this.wpService.sortByDate(res);
        this.articles = res.filter(item => item.imageUrl).slice(0, 8);
      });
    this.homeService.getWpArticles('posts', 'betting').subscribe(res => {
      this.bettingArticles = res;
    });
    // this.homeService.getWpArticles('posts', 'podcasts').subscribe(res => {
    //   this.podcastsArticles = res;
    // });
  }

}
