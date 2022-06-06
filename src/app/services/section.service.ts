import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SectionExtDtoErrors } from 'src/app/models/validation-errors/section-ext-dto-errors';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private controllerUrl: string = "sections";
  private _emptySectionExtDto: SectionExtDto = {
    sectionId: 0,
    sectionGroupId: 0,
    businessId: 0,
    branchId: 0,
    managerId: 0,
    fullAddressId: 0,
    sectionName: "",
    sectionCode: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended With SectionGroup
    sectionGroupName: "",
  
    // Extended With Manager
    managerNameSurname: "",
  
    // Extended With FullAddress
    cityId: 0,
    districtId: 0,
    addressTitle: "",
    postalCode: 0,
    addressText: "",
  
    // Extended With FullAddress + City
    cityName: "",
  
    // Extended With FullAddress + District
    districtName: "",
  };
  private _emptySectionExtDtoErrors: SectionExtDtoErrors = {
    sectionId: "",
    sectionGroupId: "",
    businessId: "",
    branchId: "",
    managerId: "",
    fullAddressId: "",
    sectionName: "",
    sectionCode: "",
    createdAt: "",
    updatedAt: "",
  
    // Extended With SectionGroup
    sectionGroupName: "",
  
    // Extended With Manager
    managerNameSurname: "",
  
    // Extended With FullAddress
    cityId: "",
    districtId: "",
    addressTitle: "",
    postalCode: "",
    addressText: "",
  
    // Extended With FullAddress + City
    cityName: "",
  
    // Extended With FullAddress + District
    districtName: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptySectionExtDto(): SectionExtDto {
    return cloneDeep(this._emptySectionExtDto);
  }

  public get emptySectionExtDtoErrors(): SectionExtDtoErrors {
    return cloneDeep(this._emptySectionExtDtoErrors);
  }

  add(sectionExtDto: SectionExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, sectionExtDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  getByBusinessId(businessId: number): Observable<ListDataResult<SectionDto>> {
    return this.http.get<ListDataResult<SectionDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }
  
  getExtById(id: number): Observable<SingleDataResult<SectionExtDto>> {
    return this.http.get<SingleDataResult<SectionExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<SectionExtDto>> {
    return this.http.get<ListDataResult<SectionExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  update(sectionExtDto: SectionExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, sectionExtDto);
  }
}
