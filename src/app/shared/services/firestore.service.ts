import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor() {}

  private getFireStoreProp(value) {
    if (!value) {
      return undefined;
    }
    const props = {
      'arrayValue': 1,
      'booleanValue': 1,
      'geoPointValue': 1,
      'integerValue': 1,
      'mapValue': 1,
      'nullValue': 1,
      'referenceValue': 1,
      'stringValue': 1,
      'timestampValue': 1
    };
    return Object.keys(value).find(k => props[k] === 1)
  }

  fireStoreParser(value) {
    const prop = this.getFireStoreProp(value);
    if (prop === 'integerValue') {
      value = Number(value[prop]);
    } else if (prop === 'arrayValue') {
      value = value[prop].values.map(v => this.fireStoreParser(v))
    } else if (prop === 'mapValue') {
      value = this.fireStoreParser(value[prop].fields)
    } else if (prop === 'geoPointValue') {
      value = { latitude: 0, longitude: 0, ...value[prop] }
    } else if (prop) {
      value = value[prop]
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(k => value[k] = this.fireStoreParser(value[k]))
    }
    return value;
  }
}
