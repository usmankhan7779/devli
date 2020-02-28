import {Injectable} from '@angular/core';
import {Parameter} from '../models/parameter';

@Injectable()
export class LibraryService {

  public static getArrayOfPossibleValues = getArrayOfPossibleValuesFunction;
  public static prepareParametersString = prepareParametersStringFunction;

  constructor() { }
}

////////////////

function getArrayOfPossibleValuesFunction(array, property) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (result.indexOf(item[property]) === -1 && item[property]) {
      result.push(item[property]);
    }
  }
  return result;
}

function prepareParametersStringFunction(parameters: Parameter[]) {
  let string = '';
  if (!parameters || parameters.length === 0) {return string; }
  string += '?';
  const length = parameters.length;
  for (let i = 0; i < length; i++) {
    const parameter = parameters[i];
    string += parameter.name + '=' + parameter.value;
    if (i !== length - 1) {string += '&'; }
  }
  return string
}
