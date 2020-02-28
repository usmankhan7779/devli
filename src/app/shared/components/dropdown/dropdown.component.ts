import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckboxObj, CommonService } from '../../services/common.service';
import { LastTeamNamePipe } from '../../pipes/last-team-name.pipe';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() readonly = false;
  @Input() filterItems: any;
  @Input() ddData: any;
  @Input() isDisabled = false;
  @Input() prop: string;
  @Input() set totalItems(val) {
    if (this.prop === 'items_per_page' && val && Array.isArray(this.ddData[this.prop]) && this.ddData[this.prop].length > 0) {
      const arr = this.ddData[this.prop].filter(item => !item.hidden);
      let prevItem = arr[arr.length - 2];
      if (!(prevItem && typeof arr[arr.length - 1].name === 'string' &&
          val > parseInt(prevItem.name, 10))) {
        for (let i = arr.length - 1; i >= 0; i--) {
          prevItem = arr[i - 1];
          const item = arr[i];
          if ((i === arr.length - 1 && isNaN(parseInt(item.name, 10))) ||
            (prevItem && val < parseInt(item.name, 10) && val <= parseInt(prevItem.name, 10))
          ) {
            item._hiddenItemsPerPage = true;
          } else {
            item._hiddenItemsPerPage = false;
          }
        }
      } else {
        for (let i = arr.length - 1; i >= 0; i--) {
          arr[i]._hiddenItemsPerPage = false;
        }
      }
    }
  }
  @Input() name: string;
  @Input() noName: string;
  @Input() prefix = '';
  @Input() wrapperClass: string;
  @Input() className: string;
  @Input() type = 'default';
  @Input() isSingleSelect = false;
  @Input() withColors: string[];
  @Input() showSelectedPerName = false;
  @Input() showReverseName = false;
  @Input() linksOnly = false;
  @Input() showTeamLogo = false;
  @Input() teamLogoType = false;
  @Input() league = false;
  @Input() allowHiddenFiltering = false;
  @Input() scrollableMenu = true;
  @Input() lastTeamNameMinWidth = null;
  @Input() lastTeamNameMaxWidth = null;

  @Output() onLinkClick = new EventEmitter();


  getMaxDollarSelected = this.commonService.getMaxDollarSelected;

  constructor(
    private commonService: CommonService,
    private lastTeamNamePipe: LastTeamNamePipe,
  ) { }

  ngOnInit() {
    if (this.prop === 'seasons') {
      this.commonService.sortYearArr(this.ddData['seasons']);
    }
  }

  showSelectedValues(names: string, items) {
    let _items;
    if (this.allowHiddenFiltering) {
      _items = items.filter(item => {
        return !item.hidden;
      });
    } else {
      _items = items;
    }
    const activeItems = this.commonService.getActiveCheckBoxItems(_items);
    const activeItemsLength = activeItems.length;
    if (_items.length && activeItemsLength === _items.length && _items.length !== 1) {
      return `All ${names}`;
    } else if (activeItemsLength === 1) {
      const fullTeamName = activeItems[0];
      let nameToShow = fullTeamName;
      if (this.lastTeamNameMaxWidth || this.lastTeamNameMinWidth) {
        const shortTeamName = this.lastTeamNamePipe.transform(fullTeamName);
        const lastTeamNameMinWidth = parseInt(this.lastTeamNameMinWidth, 10);
        const lastTeamNameMaxWidth = parseInt(this.lastTeamNameMaxWidth, 10);
        if (this.commonService.isBrowser() && !isNaN(lastTeamNameMinWidth) && !isNaN(lastTeamNameMaxWidth)&& window &&
          window.innerWidth > lastTeamNameMinWidth && window.innerWidth < lastTeamNameMaxWidth) {
          nameToShow = shortTeamName;
        }
      }
      return `
      ${this.showSelectedPerName && !this.showReverseName ? this.name + ' ' : ''}
      ${nameToShow}
      ${this.showSelectedPerName && this.showReverseName ? ' ' + this.name  : ''}
      `;
    } else if (this.noName && activeItemsLength === 0) {
      return this.noName;
    } else if (activeItemsLength === 0) {
      return `No ${names || ''}`;
    }
    return `${activeItemsLength} ${names}`;
  }

  isSelectedNone(arr: CheckboxObj[]) {
    if (this.allowHiddenFiltering) {
      return arr.filter((obj) => {
        return obj.selected && !obj.hidden;
      }).length === 0;
    }
    return arr.filter((obj) => obj.selected).length === 0;
  }

  toggleAll(event, arr: CheckboxObj[], selected: boolean) {
    if (!this.isSingleSelect) {
      event.stopPropagation();
    }
    for (const arrItem of arr) {
      if ((this.allowHiddenFiltering && !arrItem.hidden) || !this.allowHiddenFiltering) {
        arrItem.selected = selected;
      }
    }
    this.filterItems();
  }

  onToggleItem(event, item: CheckboxObj) {
    if (!this.isSingleSelect) {
      event.stopPropagation();
    }
    if (this.isSingleSelect) {
      if (item.selected) {
        return;
      }
      for (const arrItem of this.ddData[this.prop]) {
        arrItem.selected = false;
      }
    }
    item.selected = !item.selected;
    this.filterItems();
  }

  onLinkClicked(item) {
    this.onLinkClick.emit(item);
  }

  getActiveTeamLogo(_items) {
    const activeItems = this.commonService.getActiveCheckBoxItems(_items);
    if (activeItems.length === 1) {
      return this.getLogoFromName(activeItems[0]);
    }
    return null;
  }

  getLogoFromName(name) {
    if (!name) {
      return name;
    }
    return name.toLowerCase().replace(/\s/g, '-');
  }
}
