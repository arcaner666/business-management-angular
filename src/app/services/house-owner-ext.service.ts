import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { HouseOwnerExtDtoErrors } from 'src/app/models/validation-errors/house-owner-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class HouseOwnerExtService {

  private controllerUrl: string = "houseownerexts";
  private _emptyHouseOwnerExtDto: HouseOwnerExtDto = {
    houseOwnerId: 0,
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
  private _emptyHouseOwnerExtDtoErrors: HouseOwnerExtDtoErrors = {
    houseOwnerId: "",
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

  public get emptyHouseOwnerExtDto(): HouseOwnerExtDto {
    return cloneDeep(this._emptyHouseOwnerExtDto);
  }

  public get emptyHouseOwnerExtDtoErrors(): HouseOwnerExtDtoErrors {
    return cloneDeep(this._emptyHouseOwnerExtDtoErrors);
  }

  // API İstekleri
  addExt(houseOwnerExtDto: HouseOwnerExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, houseOwnerExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<HouseOwnerExtDto>> {
    return this.http.get<SingleDataResult<HouseOwnerExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<HouseOwnerExtDto>> {
    return this.http.get<ListDataResult<HouseOwnerExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(houseOwnerExtDto: HouseOwnerExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, houseOwnerExtDto);
  }
}
