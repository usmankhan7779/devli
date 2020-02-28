
import {debounceTime} from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy {
  searchModel: string;
  searchTerm$ = new Subject<string>();
  @Input() searchFn;
  @Input() debounceTime = 500;
  @Input() placeholder = 'Search Players';
  @Output() onDataFiltered = new EventEmitter();
  @Input() className;
  constructor() { }

  ngOnInit() {
    this.initFilter();
  }

  ngOnDestroy() {
    this.searchTerm$.unsubscribe();
  }

  onFilter(filterVal) {
    this.searchModel = filterVal;
    this.searchTerm$.next();
  }

  clearSearchModel() {
    this.searchModel = '';
  }

  private initFilter() {
    this.searchTerm$.pipe(
      debounceTime(this.debounceTime))
      .subscribe(() => {
        if (this.searchFn) {
          return this.onDataFiltered.emit(this.searchFn(this.searchModel));
        }
        return this.onDataFiltered.emit(this.searchModel);
      });
  }
}
