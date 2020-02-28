import { AbstractControl } from '@angular/forms';
export function ValidateUrl(control: AbstractControl) {
  const regExp = /^(http:\/\/www\.|https:\/\/www\.|www.)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  if (control.value) {
    const url = control.value.trim();
    if (regExp.test(url)) {
      return null;
    }
    return { validUrl: true };
  }
  return null;
}
