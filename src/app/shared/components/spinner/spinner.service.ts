
import {finalize, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  spinnerValueChanged = new Subject<any>();
  spinnerValue = false;
  spinnerImg = 'circle';
  spinnerText = '';

  showSpinner(spinnerImg: string = undefined, spinnerText: string = undefined) {
    this.spinnerValue = true;
    this.spinnerValueChanged.next({
      value: this.spinnerValue,
      spinnerImg,
      spinnerText
    });
  }

  hideSpinner() {
    this.spinnerValue = false;
    this.spinnerValueChanged.next({value: this.spinnerValue});
  }

  handleAPICall(apiCall: Observable<any>, spinnerImg: string = undefined, spinnerText: string = undefined) {
    let spinnerClosed = false;
    this.showSpinner(spinnerImg, spinnerText);
    return apiCall.pipe(
      map((res) => {
        spinnerClosed = true;
        this.hideSpinner();
        return res;
      }),
      finalize(() => {
        if (this.spinnerValue && !spinnerClosed) {
          this.hideSpinner();
        }
      }),);
  }
}
