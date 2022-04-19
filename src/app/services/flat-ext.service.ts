import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { FlatExtDtoErrors } from 'src/app/models/validation-errors/flat-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class FlatExtService {

  private controllerUrl: string = "flatexts";
  private _emptyFlatExtDto: FlatExtDto = {
    flatId: 0,
    sectionId: 0,
    apartmentId: 0,
    businessId: 0,
    branchId: 0,
    houseOwnerId: undefined,
    tenantId: undefined,
    flatCode: "",
    doorNumber: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended With Section
    sectionName: "",
  
    // Extended With Apartment
    apartmentName: "",
  
    // Extended With HouseOwner
    houseOwnerNameSurname: "",
  
    // Extended With Tenant
    tenantNameSurname: "",
  };
  private _emptyFlatExtDtoErrors: FlatExtDtoErrors = {
    flatId: "",
    sectionId: "",
    apartmentId: "",
    businessId: "",
    branchId: "",
    houseOwnerId: "",
    tenantId: "",
    flatCode: "",
    doorNumber: "",
    createdAt: "",
    updatedAt: "",
  
    // Extended With Section
    sectionName: "",
  
    // Extended With Apartment
    apartmentName: "",
  
    // Extended With HouseOwner
    houseOwnerNameSurname: "",
  
    // Extended With Tenant
    tenantNameSurname: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyFlatExtDto(): FlatExtDto {
    return cloneDeep(this._emptyFlatExtDto);
  }

  public get emptyFlatExtDtoErrors(): FlatExtDtoErrors {
    return cloneDeep(this._emptyFlatExtDtoErrors);
  }
  
  // API İstekleri
  addExt(flatExtDto: FlatExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, flatExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<FlatExtDto>> {
    return this.http.get<SingleDataResult<FlatExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<FlatExtDto>> {
    return this.http.get<ListDataResult<FlatExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(flatExtDto: FlatExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, flatExtDto);
  }
}
