import { Directive, HostListener, Input } from '@angular/core';
import { NewsService } from '../../../nfl/news/news.service';

@Directive({
  selector: '[appPreselectNflNewsTeamSeason]'
})
export class PreselectNflNewsTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectNflNewsTeamSeason') season: string;
  constructor(
    private newsService: NewsService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.newsService.setPreSelectedTeamSeason(this.season);
    }
  }
}
