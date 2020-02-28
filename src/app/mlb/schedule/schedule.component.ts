import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleService } from './schedule.service';
import { TitleService } from '../../shared/services/title.service';

@Component({
  selector: 'app-mlb-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  preSelectedDate: string;
  loading = false;
  pageTitle: string;
  introParagraph: string;
  bottomHeader: string;
  bottomParagraph: string;

  constructor(
    private scheduleService: ScheduleService,
    private title: TitleService
  ) { }

  ngOnInit() {
    this.preSelectedDate = this.scheduleService.getPreSelectedDate();
  }

  ngOnDestroy() {
    this.scheduleService.removePreSelectedDate();
  }

  onDataReceived(result) {
    this.pageTitle = result.heading;
    if (result.page_title) {
      this.title.setTitle(result.page_title)
    }
    this.introParagraph = result.intro_paragraph;
    this.bottomHeader = result.bottom_header;
    this.bottomParagraph = result.bottom_paragraph;
  }


}
