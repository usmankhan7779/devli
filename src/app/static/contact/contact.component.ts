
import {catchError} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidateUrl } from '../../shared/validators/url.validator';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { ContactService } from './contact.service';
import { SchemaService } from '../../shared/services/schema.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  providers: [ContactService]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  formHasBeenSent = false;
  apiRequestError = false;
  constructor(
    private spinnerService: SpinnerService,
    private contactService: ContactService,
    private schemaService: SchemaService
  ) { }

  ngOnInit() {
    this.spinnerService.spinnerImg = 'circle';
    this.spinnerService.spinnerText = '';

    this.contactForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'website': new FormControl('', [ValidateUrl]),
      'comment': new FormControl('', [Validators.required])
    });
    this.schemaService.setDefaultSchema();
  }

  onSubmit() {
    this.apiRequestError = false;
    this.formHasBeenSent = false;
    console.log(this.contactForm);
    const data = {
      name: this.contactForm.value['name'],
      email: this.contactForm.value['email'],
      website: this.contactForm.value['website'],
      comment: this.contactForm.value['comment']
    };
    this.spinnerService.handleAPICall(this.contactService.contactUs(data)).pipe(
      catchError((err) => {
        this.apiRequestError = true;
        throw err;
      }))
      .subscribe(() => {
        this.contactForm.reset();
        this.formHasBeenSent = true;
      });
  }
}
