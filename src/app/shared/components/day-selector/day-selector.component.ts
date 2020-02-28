import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss']
})
export class DaySelectorComponent implements OnInit {
  @Input() minDate = new Date('1/1/17');
  @Input() preSelectedDate;
  minDateDatePicker;
  dates: Array<any>;
  selectedDate: any;
  selectedCalendarDate: NgbDateStruct;

  @Output() dateChanged = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.minDateDatePicker = {
      year: moment(this.minDate).year(),
      month: moment(this.minDate).month() + 1,
      day: moment(this.minDate).date()
    };
    if (this.preSelectedDate) {
      this.setDate(moment(this.preSelectedDate, 'M/D/YYYY').startOf('day').format());
    } else {
      this.setDate(moment().startOf('day').format());
    }
    this.setVisibleWindow(this.selectedDate);
  }

  // Event handlers
  selectDate(date: any) {
    this.setDate(date.date);
    this.setVisibleWindow(this.selectedDate);
  }

  onCalendarDateChange(newValue: any) {
    const dateStr = moment({
      year: newValue.year,
      month: newValue.month - 1,
      day: newValue.day
    }).format();

    if (dateStr !== this.selectedDate) {
      this.setDate(dateStr);
      this.setVisibleWindow(dateStr);
    }
  }

  nextWeek() {
    this.incrementVisibleWindow(7);
  };

  prevWeek() {
    if (this.isPrevWeekDisabled()) {
      return;
    }
    const dateDiff = this.getDateDiff();
    const weekDays = -7;
    if (dateDiff < weekDays) {
      this.incrementVisibleWindow(weekDays);
    } else {
      this.incrementVisibleWindow(dateDiff);
    }
  };

  private getDateDiff() {
    const startDate = moment(this.minDate);
    const currentDate = moment(this.selectedDate);
    return startDate.diff(currentDate, 'days')
  }

  isPrevWeekDisabled() {
    return this.minDate >= new Date(this.selectedDate);
  }

  // Supporting methods
  private setDate(dateStr: string) {
    this.selectedDate = dateStr;
    this.selectedCalendarDate = {
      year: moment(dateStr).year(),
      month: moment(dateStr).month() + 1,
      day: moment(dateStr).date()
    };

    this.dateChanged.emit(this.selectedDate);
  }

  private incrementVisibleWindow(daysToAdd: number) {
    const selectedDate = moment(this.selectedDate).add(daysToAdd, 'days');
    this.setDate(selectedDate.format());
    this.setVisibleWindow(this.selectedDate);
  }

  private setVisibleWindow(startDate: any) {
    this.dates = this.enhanceWeek(startDate);
  }

  private enhanceWeek(startDate: any): Array<any> {
    const dates = [];
    const dayOfWeek = moment(startDate).startOf('day');
    for (let i = 0; i < 7; i++) {
      dates.push({
        weekDay: dayOfWeek.format('ddd'),
        shortDate: dayOfWeek.format('M/D'),
        date: dayOfWeek.format()
      });
      dayOfWeek.add(1, 'd');
    }

    return dates;
  }

}
