import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { BranchExtDtoErrors } from 'src/app/models/validation-errors/branch-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class BranchExtService {

  private controllerUrl: string = "branchexts";
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

  public get emptyBranchExtDto(): BranchExtDto {
    return cloneDeep(this._emptyBranchExtDto);
  }

  public get emptyBranchExtDtoErrors(): BranchExtDtoErrors {
    return cloneDeep(this._emptyBranchExtDtoErrors);
  }
  
  // API İstekleri
  addExt(branchExtDto: BranchExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, branchExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<BranchExtDto>> {
    return this.http.get<SingleDataResult<BranchExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<BranchExtDto>> {
    return this.http.get<ListDataResult<BranchExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(branchExtDto: BranchExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, branchExtDto);
  }
}
