import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthApiService } from '../../../auth/auth-api.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-verification-modal',
  templateUrl: './verification-modal.component.html',
  styleUrls: ['./verification-modal.component.scss']
})
export class VerificationModalComponent implements OnInit {
  @Input() blockUserActivity = false;
  @Input() email;
  d1; d2; d3; d4; d5; d6;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private authApiService: AuthApiService,
    private location: PlatformLocation
  ) {
    location.onPopState(() => {
      // ensure that modal is opened
      if (this.activeModal !== undefined) {
        this.activeModal.close();
      }
    });
  }

  ngOnInit() {
  }

  openLoginModal(delegateMessage) {
    this.activeModal.dismiss(delegateMessage);
  }

  codeChanged(event) {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onPaste(event) {
    const value = event.clipboardData.getData('Text');
    if (!value || !value.length || value.length < 6) {
      return;
    }
    const arrVal = value.trim().split('');
    this.d1 = arrVal[0];
    this.d2 = arrVal[1];
    this.d3 = arrVal[2];
    this.d4 = arrVal[3];
    this.d5 = arrVal[4];
    this.d6 = arrVal[5];
  }

  submit() {
    const vCode = `${this.d1}${this.d2}${this.d3}${this.d4}${this.d5}${this.d6}`;

    this.authApiService.verifyWith(vCode)
      .subscribe(token => {
        this.openLoginModal('Your account has been activated. Please sign in.');
      },
      err => {
        this.d1 = this.d2 = this.d3 = this.d4 = this.d5 = this.d6 = '';
        this.errorMessage = 'Invalid code. Please try again.';
      });
  }


}
