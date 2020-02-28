import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maxValueValidator(max: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (!control || typeof max !== 'number' || isNaN(Number(control.value))) {
      return null;
    }
    const input = control.value;
    const isValid = Number(input) > max;
    if (isValid) {
      return { 'maxValue': {max} }
    }
    return null;
  };
}
