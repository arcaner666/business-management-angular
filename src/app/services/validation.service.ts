import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  isNumberZero(value: number): boolean {
    return (value == 0 ? true : false);
  }

  isStringEmpty(value: string): boolean {
    return (value == "" ? true : false);
  }
}
