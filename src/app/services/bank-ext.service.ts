import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { BankExtDto } from 'src/app/models/dtos/bank-ext-dto';
import { BankExtDtoErrors } from 'src/app/models/validation-errors/bank-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class BankExtService {

  private controllerUrl: string = "bankexts";
  private _emptyBankExtDto: BankExtDto = {
    bankId: 0,
    businessId: 0,
    branchId: 0,
    accountId: 0,
    fullAddressId: 0,
    currencyId: 0,
    bankName: "",
    bankBranchName: "",
    bankCode: "",
    bankBranchCode: "",
    bankAccountCode: "",
    iban: "",
    officerName: "",
    standartMaturity: 0,
    createdAt: new Date(),
    updatedAt: new Date(),

    // Extended With Branch
    branchName: "",

    // Extended With Account
    accountGroupId: 0,
    accountOrder: 0,
    accountName: "",
    accountCode: "",
    limit: 0,

    // Extended With Account + AccountGroup
    accountGroupName: "",

    // Extended With FullAddress
    cityId: 0,
    districtId: 0,
    addressText: "",

    // Extended With Currency
    currencyName: "",
  };
  private _emptyBankExtDtoErrors: BankExtDtoErrors = {
    bankId: "",
    businessId: "",
    branchId: "",
    accountId: "",
    fullAddressId: "",
    currencyId: "",
    bankName: "",
    bankBranchName: "",
    bankCode: "",
    bankBranchCode: "",
    bankAccountCode: "",
    iban: "",
    officerName: "",
    standartMaturity: "",
    createdAt: "",
    updatedAt: "",

    // Extended With Branch
    branchName: "",

    // Extended With Account
    accountGroupId: "",
    accountOrder: "",
    accountName: "",
    accountCode: "",
    limit: "",

    // Extended With Account + AccountGroup
    accountGroupName: "",

    // Extended With FullAddress
    cityId: "",
    districtId: "",
    addressText: "",

    // Extended With Currency
    currencyName: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyBankExtDto(): BankExtDto {
    return cloneDeep(this._emptyBankExtDto);
  }

  public get emptyBankExtDtoErrors(): BankExtDtoErrors {
    return cloneDeep(this._emptyBankExtDtoErrors);
  }

  // API İstekleri
  addExt(bankExtDto: BankExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, bankExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  deleteExtByAccountId(accountId: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteextbyaccountid/${accountId}`);
  }

  getExtByAccountId(accountId: number): Observable<SingleDataResult<BankExtDto>> {
    return this.http.get<SingleDataResult<BankExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyaccountid/${accountId}`);
  }

  getExtById(id: number): Observable<SingleDataResult<BankExtDto>> {
    return this.http.get<SingleDataResult<BankExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<BankExtDto>> {
    return this.http.get<ListDataResult<BankExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(bankExtDto: BankExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, bankExtDto);
  }
}
