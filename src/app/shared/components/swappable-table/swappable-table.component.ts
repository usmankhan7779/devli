import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-swappable-table',
  templateUrl: './swappable-table.component.html',
  styleUrls: ['./swappable-table.component.scss']
})
export class SwappableTableComponent implements OnInit {
  swappingPK: any;
  swapSource: any;
  swapTarget: any;
  _emptyRows: any[];
  @Input() data: any;
  @Input() allowSorting = false;
  @Input() rowTemplate: TemplateRef<any>;
  @Input() theadTemplate: TemplateRef<any>;
  @Input() dropdownFormatter: any;
  @Input() primaryField: string;
  @Input() displayField: string;
  @Input() columnCount: number;
  @Input() placeholder: string;
  @Input() buttonOnFirstColumn? = true;
  @Input() buttonClass: string;
  @Input() noMargin = true;
  @Input() noBorder = true;
  @Input() borderBottom = false;
  @Input() apiSwap = false;
  @Input() searchFunction;
  @Input() doNotShowSelectedItem = false;
  @Input() set showEmptyRows(value) {
    this._emptyRows = new Array(value);
  };
  get showEmptyRows() {
    return this._emptyRows;
  }
  @Output() onSwap = new EventEmitter();
  @Input() showRow = () => {
    return true;
  };



  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit() { }

  swapInit = (activeItem: any, open = true) => {
    if (this.swappingPK) {
      return;
    }

    this.swapSource = activeItem;
    this.swappingPK = activeItem[this.primaryField];
  };

  swapWith = (swappingItem: any) => {
    if (this.swapSource.player_id !== swappingItem.player_id) {
      this.onSwap.emit({original: this.swapSource, new_player: swappingItem});
    }
    if (!this.apiSwap) {
      for (const key in this.swapSource) {
        if (key !== this.primaryField) {
          const swBuf = this.swapSource[key];
          this.swapSource[key] = swappingItem[key];
          this.swapTarget[key] = swBuf;
        }
      }
    }

    this.closeSwapper();
  };

  dropdownFormatterInternal = (item: any) => {
    if (this.doNotShowSelectedItem && item[this.primaryField] === this.swappingPK) {
      return;
    }
    const html = this.dropdownFormatter(item);
    return this._sanitizer.bypassSecurityTrustHtml(html);
  };

  closeSwapper() {
    this.swapTarget = null;
    this.swappingPK = null;
  }

  onBlur() {
    this.closeSwapper();
  }
}
