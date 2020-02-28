import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, Validators} from '@angular/forms';

import { AuthService } from '../../../auth/auth.service';
import { AuthApiService } from '../../../auth/auth-api.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  @Input() flashMessage;
  @Input() blockUserActivity = false;
  @Input() loginHeader = 'Login to Your Account';
  email = new FormControl('', [
    Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')
  ]);
  password = new FormControl('', [Validators.required]);
  errorMessage = '';

  loginForm = this.fb.group(
    {
      email: this.email,
      password: this.password
    }
  );

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private _authService: AuthService,
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

  openSignUpModal() {
    this.activeModal.dismiss('signUp');
  }

  openPasswordModal() {
    this.activeModal.dismiss('password');
  }

  submit() {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.flashMessage = '';
      this.authApiService.loginWith(this.loginForm.value)
        .subscribe(token => {
          this._authService.setEmail(this.loginForm.value.email);
          this._authService.setToken(token.access);
          this._authService.setRefreshToken(token.refresh);
          this._authService.userWasLoggedIn();
          this.activeModal.close();
        },
        err => {
          this.loginForm.reset();
          this.errorMessage = 'Invalid credentials. Please try again.';
        });
    }
  }

  openVerifyModal() {
    this.activeModal.dismiss('verify-code');
  }
}
