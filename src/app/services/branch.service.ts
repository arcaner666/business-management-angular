import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { BranchCodeDto } from 'src/app/models/dtos/branch-code-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { BranchExtDtoErrors } from 'src/app/models/validation-errors/branch-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private controllerUrl: string = "branches";
  private _emptyBranchDto: BranchDto = {
    branchId: 0,
    businessId: 0,
    fullAddressId: 0,
    branchOrder: 0,
    branchName: "",
    branchCode: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  private _emptyBranchExtDto: BranchExtDto = {
    branchId: 0,
    businessId: 0,
    fullAddressId: 0,
    branchOrder: 0,
    branchName: "",
    branchCode: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended With FullAddress
    cityId: 0,
    districtId: 0,
    addressTitle: "",
    postalCode: 0,
    addressText: "",
  };
  private _emptyBranchExtDtoErrors: BranchExtDtoErrors = {
    branchId: "",
    businessId: "",
    fullAddressId: "",
    branchOrder: "",
    branchName: "",
    branchCode: "",
    createdAt: "",
    updatedAt: "",
  
    // Extended With FullAddress
    cityId: "",
    districtId: "",
    addressTitle: "",
    postalCode: "",
    addressText: "",
  };
  
  constructor(
    private http: HttpClient,
  ) {}
  
  public get emptyBranchDto(): BranchDto {
    return cloneDeep(this._emptyBranchDto);
  }

  public get emptyBranchExtDto(): BranchExtDto {
    return cloneDeep(this._emptyBranchExtDto);
  }

  public get emptyBranchExtDtoErrors(): BranchExtDtoErrors {
    return cloneDeep(this._emptyBranchExtDtoErrors);
  }
  
  add(branchExtDto: BranchExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, branchExtDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  generateBranchCode(businessId: number): Observable<SingleDataResult<BranchCodeDto>> {
    return this.http.get<SingleDataResult<BranchCodeDto>>(`${environment.apiUrl}/${this.controllerUrl}/generatebranchcode/${businessId}`);
  }

  getByBusinessId(businessId: number): Observable<ListDataResult<BranchDto>> {
    return this.http.get<ListDataResult<BranchDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }

  getExtById(id: number): Observable<SingleDataResult<BranchExtDto>> {
    return this.http.get<SingleDataResult<BranchExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<BranchExtDto>> {
    return this.http.get<ListDataResult<BranchExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  update(branchExtDto: BranchExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, branchExtDto);
  }
}
