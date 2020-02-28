import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appHideAllItems]'
})
export class HideAllItemsDirective {
  @Input() appHideAllItems: any[];
  @Input() mode = false;
  @Output() hideMatchupDetails: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }


  @HostListener('click', ['$event']) onClick($event) {
    $event.stopPropagation();
    this.hideMatchupDetails.emit(null);
    this.appHideAllItems.map(items => items.showed = this.mode);
  }

}
