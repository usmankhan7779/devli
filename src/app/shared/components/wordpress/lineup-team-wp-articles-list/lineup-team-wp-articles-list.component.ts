import { Component, Input } from '@angular/core';
import { WpSmBlogItemModel } from '../models/wp-sm-blog-item.model';
import { WPService } from '../WP.service';
import { catchError, map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';


@Component({
  selector: 'app-wp-articles-list',
  templateUrl: './lineup-team-wp-articles-list.component.html',
  styleUrls: ['./lineup-team-wp-articles-list.component.scss']
})
export class WpArticlesListComponent {
  _teamName: string;
  @Input() podcasts: boolean;
  @Input() pages: boolean;
  @Input() league: 'mlb' | 'nba' | 'nfl';
  @Input() set teamName(val) {
    this.teamArticles = [];
    this._teamName = val;
    this.getTeamPosts();
  };

  teamArticles: Array<WpSmBlogItemModel>;

  constructor(
    private wpService: WPService
  ) { }

  private getTeamPosts() {
    if (this.pages) {
        this.wpService.getTeamPagesAndArticles(this._teamName, this.league, this.podcasts)
          .pipe(map(res => res), catchError(err => observableOf([]))).subscribe((res) => {
          this.wpService.sortByDate(res);
          this.teamArticles = res.filter(item => item.imageUrl).slice(0, 5);
        });
    } else {
      this.wpService.getTeamArticles(this._teamName, this.podcasts, this.league)
        .subscribe(res => {
          this.teamArticles = res;
        });
    }
  }

}
