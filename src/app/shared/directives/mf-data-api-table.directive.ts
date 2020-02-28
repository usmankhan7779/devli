import {
  Directive, Input, EventEmitter, SimpleChange, OnChanges, DoCheck, IterableDiffers,
  IterableDiffer, Output
} from '@angular/core';
import * as _ from 'lodash';
import {ReplaySubject} from 'rxjs';

export interface SortEvent {
  sortBy: string|string[];
  sortOrder: string
}

export interface PageEvent {
  activePage: number;
  rowsOnPage: number;
  dataLength: number;
}

export interface DataEvent {
  length: number;
}

@Directive({
  // tslint:disable-next-line
  selector: 'table[mfDataApi]',
  exportAs: 'mfDataApiTable'
})
export class DataApiTableDirective implements OnChanges, DoCheck {

  private diff: IterableDiffer<any>;
  // tslint:disable-next-line:no-input-rename
  @Input('mfDataApi') public inputData: any[] = [];
  // tslint:disable-next-line:no-input-rename
  @Input('mfSortBy') public sortBy: string|string[] = '';
  // tslint:disable-next-line:no-input-rename
  @Input('mfSortOrder') public sortOrder = 'asc';
  // tslint:disable-next-line:no-output-rename
  @Output('mfSortByChange') public sortByChange = new EventEmitter<string|string[]>();
  // tslint:disable-next-line:no-output-rename
  @Output('mfSortOrderChange') public sortOrderChange = new EventEmitter<string>();
  // tslint:disable-next-line:no-input-rename
  @Input('mfRowsOnPage') public rowsOnPage = 1000;
  // tslint:disable-next-line:no-input-rename
  @Input('mfActivePage') public activePage = 1;

  private mustRecalculateData = false;

  public data: any[];

  public onSortChange = new ReplaySubject<SortEvent>(1);
  public onPageChange = new EventEmitter<PageEvent>();

  public constructor(private differs: IterableDiffers) {
    this.diff = differs.find([]).create(null);
  }

  public getSort(): SortEvent {
    return {sortBy: this.sortBy, sortOrder: this.sortOrder};
  }

  public setSort(sortBy: string|string[], sortOrder: string): void {
    if (this.sortBy !== sortBy || this.sortOrder !== sortOrder) {
      this.sortBy = sortBy;
      this.sortOrder = _.includes(['asc', 'desc'], sortOrder) ? sortOrder : 'asc';
      this.mustRecalculateData = true;
      this.onSortChange.next({sortBy: sortBy, sortOrder: sortOrder});
      this.sortByChange.emit(this.sortBy);
      this.sortOrderChange.emit(this.sortOrder);
    }
  }

  public getPage(): PageEvent {
    return {activePage: this.activePage, rowsOnPage: this.rowsOnPage, dataLength: this.inputData.length};
  }

  public setPage(activePage: number, rowsOnPage: number): void {
    if (this.rowsOnPage !== rowsOnPage || this.activePage !== activePage) {
      this.activePage = this.activePage !== activePage ? activePage : this.calculateNewActivePage(this.rowsOnPage, rowsOnPage);
      this.rowsOnPage = rowsOnPage;
      this.mustRecalculateData = true;
      this.onPageChange.emit({
        activePage: this.activePage,
        rowsOnPage: this.rowsOnPage,
        dataLength: this.inputData ? this.inputData.length : 0
      });
    }
  }

  private calculateNewActivePage(previousRowsOnPage: number, currentRowsOnPage: number): number {
    const firstRowOnPage = (this.activePage - 1) * previousRowsOnPage + 1;
    const newActivePage = Math.ceil(firstRowOnPage / currentRowsOnPage);
    return newActivePage;
  }

  private recalculatePage() {
    const lastPage = Math.ceil(this.inputData.length / this.rowsOnPage);
    this.activePage = lastPage < this.activePage ? lastPage : this.activePage;
    this.activePage = this.activePage || 1;

    this.onPageChange.emit({
      activePage: this.activePage,
      rowsOnPage: this.rowsOnPage,
      dataLength: this.inputData.length
    });
  }

  public ngOnChanges(changes: {[key: string]: SimpleChange}): any {
    if (changes['rowsOnPage']) {
      this.rowsOnPage = changes['rowsOnPage'].previousValue;
      this.setPage(this.activePage, changes['rowsOnPage'].currentValue);
      this.mustRecalculateData = true;
    }
    if (changes['sortBy'] || changes['sortOrder']) {
      if (!_.includes(['asc', 'desc'], this.sortOrder)) {
        console.warn('angular2-datatable: value for input mfSortOrder must be one of [\'asc\', \'desc\'], but is:', this.sortOrder);
        this.sortOrder = 'asc';
      }
      if (this.sortBy) {
        this.onSortChange.next({sortBy: this.sortBy, sortOrder: this.sortOrder});
      }
      this.mustRecalculateData = true;
    }
    if (changes['inputData']) {
      this.inputData = changes['inputData'].currentValue || [];
      this.recalculatePage();
      this.mustRecalculateData = true;
    }
  }

  public ngDoCheck(): any {
    const changes = this.diff.diff(this.inputData);
    if (changes) {
      this.recalculatePage();
      this.mustRecalculateData = true;
    }
    if (this.mustRecalculateData) {
      this.fillData();
      this.mustRecalculateData = false;
    }
  }

  private fillData(): void {
    this.activePage = this.activePage;
    this.rowsOnPage = this.rowsOnPage;

    const offset = (this.activePage - 1) * this.rowsOnPage;
    let data = this.inputData;
    const sortBy = this.sortBy;

    // commented out next lines to do not preform f/e sorting

    // if (typeof sortBy === 'string' || sortBy instanceof String) {
    //   data = _.orderBy(data, this.caseInsensitiveIteratee(<string>sortBy), [this.sortOrder]);
    // } else {
    //   data = _.orderBy(data, sortBy, [this.sortOrder]);
    // }
    data = _.slice(data, offset, offset + this.rowsOnPage);
    this.data = data;
  }

  // private caseInsensitiveIteratee(sortBy: string) {
  //   return (row: any): any => {
  //     let value = row;
  //     for (const sortByProperty of sortBy.split('.')) {
  //       if (value) {
  //         value = value[sortByProperty];
  //       }
  //     }
  //     if (value && typeof value === 'string' || value instanceof String) {
  //       return value.toLowerCase();
  //     }
  //     return value;
  //   };
  // }
}
