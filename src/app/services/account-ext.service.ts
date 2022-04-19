import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { AccountCodeDto } from 'src/app/models/dtos/account-code-dto';
import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { AccountGetByAccountGroupCodesDto } from 'src/app/models/dtos/account-get-by-account-group-codes-dto';
import { AccountGroupCodesDto } from 'src/app/models/dtos/account-group-codes-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class AccountExtService {

  private controllerUrl: string = "accountexts";
  private _emptyAccountExtDto: AccountExtDto = {
    accountId: 0,
    businessId: 0,
    branchId: 0,
    accountGroupId: 0,
    accountTypeId: 0,
    accountOrder: 0,
    accountName: "",
    accountCode: "",
    taxOffice: "",
    taxNumber: undefined,
    identityNumber: undefined,
    debitBalance: 0,
    creditBalance: 0,
    balance: 0,
    limit: 0,
    standartMaturity: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended With Branch
    branchName: "",
  
    // Extended With AccountGroup
    accountGroupName: "",
    accountGroupCode: "",
  
    // Extended With AccountType
    accountTypeName: "",
  
    // Added Custom Required Fields
    nameSurname: "",
    phone: "",
  };
  private _emptyAccountExtDtoErrors: AccountExtDtoErrors = {
    accountId: "",
    businessId: "",
    branchId: "",
    accountGroupId: "",
    accountTypeId: "",
    accountOrder: "",
    accountName: "",
    accountCode: "",
    taxOffice: "",
    taxNumber: "",
    identityNumber: "",
    debitBalance: "",
    creditBalance: "",
    balance: "",
    limit: "",
    standartMaturity: "",
    createdAt: "",
    updatedAt: "",
  
    // Extended With Branch
    branchName: "",
  
    // Extended With AccountGroup
    accountGroupName: "",
    accountGroupCode: "",
  
    // Extended With AccountType
    accountTypeName: "",
  
    // Added Custom Required Fields
    nameSurname: "",
    phone: "",
  };
  private _emptyAccountGetByAccountGroupCodesDto: AccountGetByAccountGroupCodesDto = {
    businessId: 0,
    accountGroupCodes: [],
  };
  private _emptyAccountGroupCodesDto: AccountGroupCodesDto = {
    accountGroupCodes: [],
  };
  
  constructor(
    private http: HttpClient, 
  ) {}
  
  public get emptyAccountExtDto(): AccountExtDto {
    return cloneDeep(this._emptyAccountExtDto);
  }

  public get emptyAccountExtDtoErrors(): AccountExtDtoErrors {
    return cloneDeep(this._emptyAccountExtDtoErrors);
  }
  
  public get emptyAccountGetByAccountGroupCodesDto(): AccountGetByAccountGroupCodesDto {
    return cloneDeep(this._emptyAccountGetByAccountGroupCodesDto);
  }

  public get emptyAccountGroupCodesDto(): AccountGroupCodesDto {
    return cloneDeep(this._emptyAccountGroupCodesDto);
  }

  // API İstekleri
  addExt(accountExtDto: AccountExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, accountExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  generateAccountCode(businessId: number, branchId: number, accountGroupCode: string): Observable<SingleDataResult<AccountCodeDto>> {
    return this.http.get<SingleDataResult<AccountCodeDto>>(`${environment.apiUrl}/${this.controllerUrl}/generateaccountcode/${businessId}/${branchId}/${accountGroupCode}`);
  }

  getExtById(id: number): Observable<SingleDataResult<AccountExtDto>> {
    return this.http.get<SingleDataResult<AccountExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<AccountExtDto>> {
    return this.http.get<ListDataResult<AccountExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  getExtsByBusinessIdAndAccountGroupCodes(accountGetByAccountGroupCodesDto: AccountGetByAccountGroupCodesDto): Observable<ListDataResult<AccountExtDto>> {
    return this.http.post<ListDataResult<AccountExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessidandaccountgroupcodes`, accountGetByAccountGroupCodesDto);
  }

  updateExt(accountExtDto: AccountExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, accountExtDto);
  }
}
