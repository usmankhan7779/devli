import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { maxValueValidator } from '../validators/max.validator';

@Directive({
  selector: '[appMax][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NumberMaxDirective, multi: true }
  ]
})
export class NumberMaxDirective implements Validator {
  @Input() appMax: number;
  @Input() appMin: number;
  private _validate = maxValueValidator;
  constructor() { }

  validate(control: AbstractControl): {[validator: string]: string} {
    const max = this.appMin > this.appMax ? this.appMin : this.appMax;
    return this._validate(max)(control);
  }
}
