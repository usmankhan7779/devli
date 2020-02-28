import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-defer-load',
  template: `
    <div (appDeferLoad)="showElementFn()">
      <ng-container *ngIf="showElement">
        <ng-template [ngTemplateOutlet]="detailRef"></ng-template>
      </ng-container>
    </div>
  `
})
export class DeferLoadComponent implements OnInit {
  showElement = false;
  @ContentChild(TemplateRef, {static: false}) detailRef;
  constructor() {
  }

  ngOnInit() {
  }

  showElementFn() {
    this.showElement = true;
  }

}
