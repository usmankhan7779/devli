/* tslint:disable */
import { Component, Input, OnInit } from '@angular/core';
import { DataTable, SortEvent } from '@pascalhonegger/ng-datatable';
import { DataApiTableDirective } from '../../directives/mf-data-api-table.directive';

@Component({
  selector: 'mfSorter',
  templateUrl: './mf-sorter.component.html',
  styleUrls: ['./mf-sorter.component.scss']
})
export class MfSorterComponent implements OnInit {
  @Input('by') sortBy: string;
  @Input() mfTable;
  @Input() name;
  @Input() set selectedSortName(value) {
    if (value !== this._selectedSortName) {
      this._selectedSortName = value;
    }
  };

  private _selectedSortName: string;

  isSortedByMeAsc = false;
  isSortedByMeDesc = false;

  public constructor(mfTable: DataTable) {
    this.mfTable = this.mfTable || mfTable;
  }

  public ngOnInit(): void {
    commonOnInit.call(this);
  }

  sort() {
    commonSort.call(this);
  }
}

@Component({
  selector: 'mfSorterApi',
  templateUrl: './mf-sorter.component.html',
  styleUrls: ['./mf-sorter.component.scss']
})
export class MfSorterApiComponent implements OnInit {
  @Input('by') sortBy: string;
  @Input() mfTable;

  isSortedByMeAsc = false;
  isSortedByMeDesc = false;

  public constructor(mfTable: DataApiTableDirective) {
    this.mfTable = this.mfTable || mfTable;
  }

  public ngOnInit(): void {
    commonOnInit.call(this);
  }

  sort() {
    commonSort.call(this);
  }
}


function commonOnInit() {
  this.mfTable.onSortChange.subscribe((event: SortEvent) => {
    setTimeout(() => {
      if (this._selectedSortName && this.name && this._selectedSortName === this.name) {
        this.isSortedByMeAsc = (event.sortOrder == 'asc');
        this.isSortedByMeDesc = (event.sortOrder == 'desc');
      } else {
        this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == 'asc');
        this.isSortedByMeDesc = (event.sortBy == this.sortBy && event.sortOrder == 'desc');
      }
    }, 0);
  });
}

function commonSort() {
  if (this.isSortedByMeDesc) {
    this.mfTable.setSort(this.sortBy, 'asc');
  } else {
    this.mfTable.setSort(this.sortBy, 'desc');
  }
}
