import {Component, OnInit, Input} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-dollars',
  templateUrl: './dollars.component.html',
  styleUrls: ['./dollars.component.scss']
})
export class DollarsComponent implements OnInit {

  // number of signs to show
  @Input() amount: number;
  // 'outline' or 'filled', by default it's outline
  @Input() type?: string;
  // color class (see scss file), but possible to add any class
  @Input() classes?: string;

  @Input() color?: string;

  isFilled: boolean;

  constructor() {
  }

  ngOnInit() {
    this.isFilled = (this.type === 'filled');
  }

  setStyle(color, amount, i) {
    const styles = {
      'color': this.isFilled ? color : (amount > i ? color : ''),
      'border-color': this.isFilled ? 'none' : (amount > i ? color : '')
    };
    if (this.classes && _.includes(this.classes, 'bg-dollar')) {
      styles.color = 'white';
      styles['background-color'] = (amount > i ? color : '#e1e1e1');
      styles['border-color'] = styles['background-color'];
    }
    return styles;
  }

}
