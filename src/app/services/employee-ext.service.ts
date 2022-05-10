import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { EmployeeExtDto } from 'src/app/models/dtos/employee-ext-dto';
import { EmployeeExtDtoErrors } from 'src/app/models/validation-errors/employee-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class EmployeeExtService {

  private controllerUrl: string = "employeeexts";
  private _emptyEmployeeExtDto: EmployeeExtDto = {
    employeeId: 0,
    businessId: 0,
    branchId: 0,
    accountId: 0,
    employeeTypeId: 0,
    nameSurname: "",
    email: "",
    phone: "",
    dateOfBirth: undefined,
    gender: "",
    notes: "",
    avatarUrl: "",
    identityNumber: 0,
    stillWorking: false,
    startDate: new Date(),
    quitDate: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended With Account
    accountGroupId: 0,
    accountOrder: 0,
    accountName: "",
    accountCode: "",
    limit: 0,

    // Extended With EmployeeType
    employeeTypeName: "",
  };
  private _emptyEmployeeExtDtoErrors: EmployeeExtDtoErrors = {
    employeeId: "",
    businessId: "",
    branchId: "",
    accountId: "",
    employeeTypeId: "",
    nameSurname: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    notes: "",
    avatarUrl: "",
    identityNumber: "",
    stillWorking: "",
    startDate: "",
    quitDate: "",
    createdAt: "",
    updatedAt: "",
  
    // Extended With Account
    accountGroupId: "",
    accountOrder: "",
    accountName: "",
    accountCode: "",
    limit: "",

    // Extended With EmployeeType
    employeeTypeName: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyEmployeeExtDto(): EmployeeExtDto {
    return cloneDeep(this._emptyEmployeeExtDto);
  }

  public get emptyEmployeeExtDtoErrors(): EmployeeExtDtoErrors {
    return cloneDeep(this._emptyEmployeeExtDtoErrors);
  }

  // API İstekleri
  addExt(employeeExtDto: EmployeeExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, employeeExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtByAccountId(accountId: number): Observable<SingleDataResult<EmployeeExtDto>> {
    return this.http.get<SingleDataResult<EmployeeExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyaccountid/${accountId}`);
  }

  getExtById(id: number): Observable<SingleDataResult<EmployeeExtDto>> {
    return this.http.get<SingleDataResult<EmployeeExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<EmployeeExtDto>> {
    return this.http.get<ListDataResult<EmployeeExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(employeeExtDto: EmployeeExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, employeeExtDto);
  }
}
