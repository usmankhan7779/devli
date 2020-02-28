import { Directive, HostListener, Input } from '@angular/core';
import { NewsService } from '../../../nba/news/news.service';

@Directive({
  selector: '[appPreselectNbaNewsTeamSeason]'
})
export class PreselectNbaNewsTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNbaNewsTeamSeason') season: string;
  constructor(
    private newsService: NewsService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.newsService.setPreSelectedTeamSeason(this.season);
    }
  }
}
