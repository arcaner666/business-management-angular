import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';
import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';
import { TenantExtDtoErrors } from 'src/app/models/validation-errors/tenant-ext-dto-errors';

@Injectable({
  providedIn: 'root'
})
export class TenantExtService {

  private controllerUrl: string = "tenantexts";
  private _emptyTenantExtDto: TenantExtDto = {
    tenantId: 0,
    businessId: 0,
    branchId: 0,
    accountId: 0,
    nameSurname: "",
    email: "",
    phone: "",
    dateOfBirth: undefined,
    gender: "",
    notes: "",
    avatarUrl: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended With Account
    accountGroupId: 0,
    accountOrder: 0,
    accountName: "",
    accountCode: "",
    taxOffice: "",
    taxNumber: 0,
    identityNumber: 0,
    limit: 0,
    standartMaturity: 0,
  };
  private _emptyTenantExtDtoErrors: TenantExtDtoErrors = {
    tenantId: "",
    businessId: "",
    branchId: "",
    accountId: "",
    nameSurname: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    notes: "",
    avatarUrl: "",
    createdAt: "",
    updatedAt: "",
  
    // Extended With Account
    accountGroupId: "",
    accountOrder: "",
    accountName: "",
    accountCode: "",
    taxOffice: "",
    taxNumber: "",
    identityNumber: "",
    limit: "",
    standartMaturity: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyTenantExtDto(): TenantExtDto {
    return cloneDeep(this._emptyTenantExtDto);
  }

  public get emptyTenantExtDtoErrors(): TenantExtDtoErrors {
    return cloneDeep(this._emptyTenantExtDtoErrors);
  }

  // API İstekleri
  addExt(tenantExtDto: TenantExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, tenantExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtByAccountId(accountId: number): Observable<SingleDataResult<TenantExtDto>> {
    return this.http.get<SingleDataResult<TenantExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyaccountid/${accountId}`);
  }

  getExtById(id: number): Observable<SingleDataResult<TenantExtDto>> {
    return this.http.get<SingleDataResult<TenantExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<TenantExtDto>> {
    return this.http.get<ListDataResult<TenantExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(tenantExtDto: TenantExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, tenantExtDto);
  }
}
