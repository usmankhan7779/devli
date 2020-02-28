import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'logo',
  pure: false
})

export class LogoPipe implements PipeTransform {
  transform(value: string, league = 'mlb', type = 'bordered', fromName = false): string {
    let _value = value;
    if (!_value || typeof _value !== 'string') {
      console.warn('no logo', 'LogoPipe', 'value:', _value);
      return _value;
    }

    if (fromName) {
      _value = _value.toLowerCase().replace(/\s/g, '-');
    }

    const routeName = _value.split('/').pop().replace('.', '');
    const postfix = type === 'bordered' ? 'largest' : 'white';

    return `/assets/images/${league}/logos/${type}/${routeName}-${postfix}.svg`;
  }
}
