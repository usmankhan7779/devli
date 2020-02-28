import {Component, OnInit, Input} from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() config: {
    'green': number,
    'red': number,
    'light-green': number,
    'yellow': number,
    'orange': number,
  };
  @Input() value: number;
  @Input() percentage = false;
  @Input() reverse = false;
  @Input() hideColor = false;

  constructor(
    private commonService: CommonService
  ) { }

  setColorRatingClass(hideColor) {
    if (!hideColor) {
      return this.commonService.setRatingClass(this.value, this.reverse, this.config);
    }
    return '';
  }

  ngOnInit() {
  }


}
