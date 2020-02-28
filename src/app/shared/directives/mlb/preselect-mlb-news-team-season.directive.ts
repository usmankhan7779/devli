import { Directive, HostListener, Input } from '@angular/core';
import { NewsService } from '../../../mlb/news/news.service';

@Directive({
  selector: '[appPreselectMlbNewsTeamSeason]'
})
export class PreselectMlbNewsTeamSeasonDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('appPreselectMlbNewsTeamSeason') season: string;
  constructor(
    private newsService: NewsService
  ) { }

  @HostListener('click') onClick() {
    if (this.season) {
      this.newsService.setPreSelectedTeamSeason(this.season);
    }
  }
}
