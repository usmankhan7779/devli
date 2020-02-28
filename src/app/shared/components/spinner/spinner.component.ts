import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  text: string;
  imgType: string;
  showSpinner = false;
  constructor(
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    this.spinnerService.spinnerValueChanged.subscribe((options) => {
      this.imgType = options.spinnerImg || this.spinnerService.spinnerImg;
      this.text = options.spinnerText || this.spinnerService.spinnerText;
      this.showSpinner = options.value;
    })
  }

}
