import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-rating-ten',
  template: `
    <span [ngClass]="setColorRatingClass(rating)">{{rating}}</span>
  `,
  styleUrls: ['./rating-ten.component.scss']
})
export class RatingTenComponent {
  @Input() rating;

  constructor() { }

  setColorRatingClass(value: number) {
    let currentClass = 'red';
    if (value >= 90) {
      currentClass = 'green';
    } else if (value >= 84) {
      currentClass = 'light-green';
    } else if (value >= 78) {
      currentClass = 'yellow';
    } else if (value >= 72) {
      currentClass = 'orange';
    }
    return `rating ${currentClass}`;
  }
}
