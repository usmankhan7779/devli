import { AbstractControl, ValidatorFn } from '@angular/forms';

export function minValueValidator(min: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (!control || typeof min !== 'number' || isNaN(Number(control.value))) {
      return null;
    }
    const input = control.value;
    const isNotValid = Number(input) < min;
    if (isNotValid) {
      return { 'minValue': {min} }
    }
    return null;
  };
}
