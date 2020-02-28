import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-color-badge',
  template: `
    <ng-container *ngIf="value">
      <ng-container *ngIf="wind; else normalTpl">
      <span class="color-badge" [ngClass]="setColorClass(value)">
        {{wind.wind}}
        <ng-container *ngIf="wind.wind && wind.wind !== 'Dome'">
          <span>mph</span>
          <img  class="wind-direction-arrow"
                [style.transform]="'rotate(' + wind.wind_deg + 'deg)'"
                src="/assets/images/arrow.png" />
        </ng-container>
      </span>
      </ng-container>
      <ng-template #normalTpl>
        <span class="color-badge" [ngClass]="setColorClass(value)">{{value}}</span>
      </ng-template>
    </ng-container>
  `,
  styles: [`
    img.wind-direction-arrow {
      width: 10px;
      position: relative;
      top: -2px;
    }
    .color-badge {
      border-radius: 5px;
      padding: 1px 5px;
      display: inline-block;
    }
    .color-badge-green {
      background-color: #70ad46;
    }
    .color-badge-green-2 {
      background-color: #8bc165;
    }
    .color-badge-green-3 {
      background-color: #a6cf8a;
    }
    .color-badge-yellow {
      background-color: #ffda65;
    }
    .color-badge-yellow-2 {
      background-color: #ffe698;
    }
    .color-badge-yellow-3 {
      background-color: #fff3cb;
    }
    .color-badge-red {
      background-color: #fa5656;
    }
    .color-badge-red-2 {
      background-color: #fb8888;
    }
    .color-badge-red-3 {
      background-color: #fdb9b9;
    }
  `]
})
export class ColorBadgeComponent {
  @Input() value;
  @Input() reverse: boolean;
  @Input() reverseColors: boolean;
  @Input() colorValues: number[];
  @Input() wind: {wind: number, wind_deg: number};
  @Input() isPitcher: boolean;
  @Input() abs: boolean;

  private readonly classNames = [
    'color-badge-green',
    'color-badge-green-2',
    'color-badge-green-3',
    'color-badge-yellow',
    'color-badge-yellow-2',
    'color-badge-yellow-3',
    'color-badge-red',
    'color-badge-red-2',
    'color-badge-red-3'
  ];

  private readonly fiveClassNames = [
    this.classNames[0],
    this.classNames[1],
    this.classNames[3],
    this.classNames[6],
    this.classNames[7]
  ];

  private readonly mainClassNames = [
    'color-badge-green',
    'color-badge-yellow',
    'color-badge-red',
  ];

  constructor() { }

  setColorClass(value) {
    if (!this.colorValues || value === null || value === undefined) {
      return;
    }
    if (this.wind) {
      if (this.isPitcher) {
        switch (true) {
          case this.wind.wind >= 8 && this.wind.wind_deg > 90 && this.wind.wind_deg < 270:
            return this.mainClassNames[0];
          case this.wind.wind >= 8 && (this.wind.wind_deg < 90 || this.wind.wind_deg > 270):
            return this.mainClassNames[2];
          default:
            return this.mainClassNames[1];
        }
      } else {
        switch (true) {
          case this.wind.wind >= 8 && this.wind.wind_deg > 90 && this.wind.wind_deg < 270:
            return this.mainClassNames[2];
          case this.wind.wind >= 8 && (this.wind.wind_deg < 90 || this.wind.wind_deg > 270):
            return this.mainClassNames[0];
          default:
            return this.mainClassNames[1];
        }
      }
    } else {
      const floatValue = this.abs ? Math.abs(parseFloat(value)) : parseFloat(value);
      let classNames = this.classNames.slice(0);
      if (this.colorValues.length === 5) {
        classNames = this.fiveClassNames.slice(0);
      }
      if (this.reverseColors) {
        classNames = classNames.reverse();
      }
      if (this.reverse) {
        for (let i = 0; i < this.colorValues.length - 1; i++) {
          if (floatValue <= this.colorValues[i]) {
            return classNames[i];
          }
        }
        return classNames[classNames.length - 1];
      } else {
        for (let i = 0; i < this.colorValues.length - 1; i++) {
          if (floatValue >= this.colorValues[i]) {
            return classNames[i];
          }
        }
        return classNames[classNames.length - 1];
      }
    }
  }
}
