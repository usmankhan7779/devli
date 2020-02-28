import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-week-selector-mobile',
  templateUrl: './week-selector-mobile.component.html',
  styleUrls: ['./week-selector-mobile.component.scss']
})
export class WeekSelectorMobileComponent {
  @Output() weekChanged = new EventEmitter();
  @Input() className: string;
  @Input() set weekCount(val) {
    if (!val || val === this._weekCount) {
      return;
    }
    this._weekCount = val;
    this.data.weeks = this.generateWeeks(1, this._weekCount);
  };
  @Input() weekLimit = 21;
  @Input() set selectedWeek(val) {
    if (val === this._selectedWeek) {
      return;
    }
    this.setWeek(val, false, false);
  };
  _selectedWeek: number;
  _weekCount: number;
  data = {
    weeks: []
  };
  constructor(
    private commonService: CommonService
  ) { }

  // Event handler
  selectWeek() {
    const selectedWeek = this.commonService.getActiveCheckBoxItems(this.data.weeks, 'name')[0];
    this.setWeek(selectedWeek);
  }

  private setWeek(weekNo, initial = false, emit = true) {
    this._selectedWeek = parseInt(weekNo, 10);
    this.data.weeks.forEach(week => {
      week.selected = this._selectedWeek === parseInt(week.name, 10);
    });
    if (emit) {
      this.weekChanged.emit({
        week: this._selectedWeek,
        initial
      });
    }
  }

  generateWeeks(startWeekNo: number, weekCount: number): Array<any> {
    const weeks = [];

    for (let i = 0; i < weekCount; i++) {
      const weekNo = i + startWeekNo;
      weeks.push({
        name: weekNo,
        selected: this._selectedWeek === weekNo,
      });
      if (i + startWeekNo === this.weekLimit) {
        break;
      }
    }

    return weeks;
  }

}
