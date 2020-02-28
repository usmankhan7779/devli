import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { AuthApiService } from '../../../auth/auth-api.service';
import { PlatformLocation } from '@angular/common';
@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss']
})
export class ForgotPasswordModalComponent implements OnInit {
  @Input() blockUserActivity = false;
  email = new FormControl('', [
    Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
  ]);
  errorMessage = '';

  resetForm = this.fb.group(
    {
      email: this.email
    }
  );

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private location: PlatformLocation
  ) {
    location.onPopState(() => {
      // ensure that modal is opened
      if (this.activeModal !== undefined) {
        this.activeModal.close();
      }
    });
    this.resetForm.valueChanges.subscribe(data => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  ngOnInit() {
  }

  openLoginModal(delegateMessage) {
    this.activeModal.dismiss(delegateMessage);
  }

  submit() {
    if (this.resetForm.valid) {
      this.authApiService.resetPassword(this.resetForm.value.email)
        .subscribe(res => {
          this.openLoginModal('Check Your Email for New Password');
        },
        err => {
          this.resetForm.reset();
          this.errorMessage = 'Error during the operation. Please contact the administrator.';
        });
    }
  }
}
