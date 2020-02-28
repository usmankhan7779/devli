import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { minValueValidator } from '../validators/min.validator';

@Directive({
  selector: '[appMin][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NumberMinDirective, multi: true }
  ]
})
export class NumberMinDirective implements Validator {
  @Input() appMax: number;
  @Input() appMin: number;
  private _validate = minValueValidator;
  constructor() { }

  validate(control: AbstractControl): {[validator: string]: string} {
    const min = this.appMin < this.appMax ? this.appMin : this.appMax;
    return this._validate(min)(control);
  }
}
