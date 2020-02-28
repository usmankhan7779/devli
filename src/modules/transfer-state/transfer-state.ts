import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
@Injectable()
export class TransferState {
  private _map = new Map<string, any>();

  constructor() { }

  keys() {
    return this._map.keys();
  }

  get(key: string): any {
    const cachedValue = this._map.get(key);
    this._map.delete(key);
    return cachedValue;
  }

  set(key: string, value: any): Map<string, any> {
    return this._map.set(key, _.cloneDeep(value)); // clone deep to be sure that response won't be overridden
  }

  toJson(): any {
    const obj = {};
    Array.from(this.keys())
      .forEach(key => {
        obj[key] = this.get(key);
      });
    return obj;
  }

  initialize(obj: any): void {
    const strigifiedObj = JSON.stringify(obj);
    const keyToReplace = '<\\/scr' + 'ipt>';
    let formattedObj: any = {};
    if (strigifiedObj.indexOf(keyToReplace) !== -1) {
      formattedObj = Object.keys(JSON.parse(strigifiedObj.replace(
        new RegExp(keyToReplace, 'g'),
        '<\/scr' + 'ipt>')))
    } else {
      formattedObj = Object.keys(obj);
    }
    formattedObj.forEach(key => {
        this.set(key, obj[key]);
      });
  }

  inject(): void { }
}
