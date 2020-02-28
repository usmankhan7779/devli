import { Component, Input, OnInit } from '@angular/core';
import { TimeZoneService } from '../../../services/time-zone.service';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss']
})
export class NewsItemComponent implements OnInit {
  @Input() cardLeague = 'mlb';
  @Input() cardTitle: string;
  @Input() cardImageRoute: string;
  @Input() cardDate: Date;
  @Input() cardContent: string;
  @Input() cardDateFormat: string;
  @Input() cardPreOpened = false;
  @Input() fullLogoUrl: boolean;
  @Input() borderedLogo = true;

  timeZone = this.timeZoneService.getTimeZoneAbbr();

  id: string;

  constructor(
    private timeZoneService: TimeZoneService
  ) { }

  ngOnInit() {
    this.id = 'newsItem-' + new Date(this.cardDate).getTime();
  }

}
