import { Directive, HostListener, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NumberOnlyDirective, multi: true }
  ]
})
export class NumberOnlyDirective implements Validator {
  @Input() appNumberOnly: boolean;
  @Input() validation: boolean;

  constructor() { }

  validate(control: AbstractControl): {[validator: string]: string} {
    if (!control.value || !this.validation) {
      return null;
    }
    let value = control.value;
    if (typeof control.value === 'string') {
      value = control.value.trim();
    }

    if (!isNaN(Number(value))) {
      return null;
    }


    return {numberOnly: 'not a number'};
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.appNumberOnly) {
      if ([46, 8, 9, 27, 13, 110, 190, 189].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }
  }
}
