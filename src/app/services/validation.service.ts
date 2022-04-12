import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  // Validasyon başarılıysa true, başarısız olursa false dönmeli.

  number(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value <= 0 ? false : true);
  }

  numberPreciseLength(value: number | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.toString().length != length ? false : true);
  }

  string(value: string | undefined | null): boolean {
    return (value == undefined || value == null || value == "" ? false : true);
  }

  stringPreciseLength(value: string | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.length != length ? false : true);
  }
}
