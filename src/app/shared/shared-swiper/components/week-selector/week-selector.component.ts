import {
  Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, Renderer2,
  ElementRef
} from '@angular/core';

import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-week-selector',
  templateUrl: './week-selector.component.html',
  styleUrls: ['./week-selector.component.scss']
})
export class WeekSelectorComponent implements AfterViewInit {
  weeks: Array<any>;

  public config: SwiperConfigInterface = {
    direction: 'horizontal',
    // slidesPreview: 'auto',
    observer: true,
    scrollbar: false,
    keyboard: true,
    navigation: true,
    mousewheel: true,
    // pagination: '.swiper-pagination',
    pagination: false,
    slideNextClass: '.swiper-button-next',
    slidePrevClass: '.swiper-button-prev'
  };
  @ViewChild(SwiperDirective, {static: false}) swiperView: SwiperDirective;
  @Output() weekChanged = new EventEmitter();
  @Input() set weekCount(val) {
    if (val === this._weekCount) {
      return;
    }
    this._weekCount = val;
    this.renderer.setStyle(
      this.weekSelectorRef.nativeElement,
      'max-width',
      (this.maxWidth || this.getDefaultWeekSelectorMaxWidth()) + 'px'
    );
    this.setVisibleWindow(1);
  };
  @Input() weekLimit = 21;
  @Input() set selectedWeek(val) {
    if (val === this._selectedWeek) {
      return;
    }
    this._selectedWeek = val;
    this.setWeek(this._selectedWeek || 1, true);
  };
  @Input() maxWidth: number;
  @ViewChild('weekSelector', {static: false}) private weekSelectorRef: ElementRef;
  _weekCount = 21;
  _selectedWeek: number;
  constructor(
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    if (this.swiperView) {
      const selectedWeek = this._selectedWeek ? this._selectedWeek - 1 : 0;
      this.swiperView.setIndex(selectedWeek);
    }
  }

  // Event handlers
  selectWeek(week) {
    this.setWeek(week.no);
  }

  private getDefaultWeekSelectorMaxWidth() {
    const widthPerWeek = 75;
    const navigationWidth = 120;
    const borderWidthPerWeek = 1;
    return this._weekCount * widthPerWeek + navigationWidth + borderWidthPerWeek * this._weekCount;
  }

  private setWeek(weekNo, initial = false) {
    this._selectedWeek = parseInt(weekNo, 10);
    this.weekChanged.emit({
      week: this._selectedWeek,
      initial
    });
  }

  private setVisibleWindow(startWeekNo: number) {
    this.weeks = this.generateWeeks(startWeekNo, this._weekCount);
  }

  private generateWeeks(startWeekNo: number, weekCount: number): Array<any> {
    const weeks = [];

    for (let i = 0; i < weekCount; i++) {
      weeks.push({
        no: i + startWeekNo
      });
      if (i + startWeekNo === this.weekLimit) {
        break;
      }
    }

    return weeks;
  }
}
