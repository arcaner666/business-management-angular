import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { CashExtDto } from 'src/app/models/dtos/cash-ext-dto';
import { CashExtDtoErrors } from 'src/app/models/validation-errors/cash-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  private controllerUrl: string = "cash";
  private _emptyCashExtDto: CashExtDto = {
    cashId: 0,
    businessId: 0,
    branchId: 0,
    accountId: 0,
    currencyId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
        
    // Extended With Account
    accountGroupId: 0,
    accountOrder: 0,
    accountName: "",
    accountCode: "",
    limit: 0,
        
    // Extended With Currency
    currencyName: "",
  };
  private _emptyCashExtDtoErrors: CashExtDtoErrors = {
    cashId: "",
    businessId: "",
    branchId: "",
    accountId: "",
    currencyId: "",
    createdAt: "",
    updatedAt: "",
        
    // Extended With Account
    accountGroupId: "",
    accountOrder: "",
    accountName: "",
    accountCode: "",
    limit: "",
    
    // Extended With Currency
    currencyName: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyCashExtDto(): CashExtDto {
    return cloneDeep(this._emptyCashExtDto);
  }

  public get emptyCashExtDtoErrors(): CashExtDtoErrors {
    return cloneDeep(this._emptyCashExtDtoErrors);
  }

  add(cashExtDto: CashExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, cashExtDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  deleteByAccountId(accountId: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deletebyaccountid/${accountId}`);
  }

  getExtByAccountId(accountId: number): Observable<SingleDataResult<CashExtDto>> {
    return this.http.get<SingleDataResult<CashExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyaccountid/${accountId}`);
  }

  getExtById(id: number): Observable<SingleDataResult<CashExtDto>> {
    return this.http.get<SingleDataResult<CashExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<CashExtDto>> {
    return this.http.get<ListDataResult<CashExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  update(cashExtDto: CashExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, cashExtDto);
  }
}
