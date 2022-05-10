import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private controllerUrl: string = "currencies";

  constructor(
    private http: HttpClient,
  ) {}

  // API İstekleri
  getAll(): Observable<ListDataResult<CurrencyDto>> {
    return this.http.get<ListDataResult<CurrencyDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }
}
