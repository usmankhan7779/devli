import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators} from '@angular/forms';

import { AuthApiService } from '../../../auth/auth-api.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss']
})
export class SignupModalComponent implements OnInit {
  @Input() blockUserActivity = false;
  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [
    Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
  ]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirm_password = new FormControl('', [Validators.required]);
  errorMessage = '';

  signupForm = this.fb.group(
    {
      username: this.username,
      email: this.email,
      password: this.password,
      confirm_password: this.confirm_password
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
    this.signupForm.valueChanges.subscribe(data => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  ngOnInit() {
  }

  openLoginModal() {
    this.activeModal.dismiss('login');
  }

  openVerificationModal(email) {
    this.activeModal.dismiss(email);
  }

  submit() {
    if (this.signupForm.valid) {
      // Submit now : validation succeeded.
      this.authApiService.signupWith(this.signupForm.value)
        .subscribe(res => {
          this.openVerificationModal(this.signupForm.value.email);
        },
        err => {
          this.errorMessage = 'Error while processing your request.';
          // this.signupForm.patchValue({password: '', confirm_password: ''});
        });
    }
  }
}
