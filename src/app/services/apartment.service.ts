import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { ApartmentExtDtoErrors } from 'src/app/models/validation-errors/apartment-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private controllerUrl: string = "apartments";
  private _emptyApartmentExtDto: ApartmentExtDto = {
    apartmentId: 0,
    sectionId: 0,
    businessId: 0,
    branchId: 0,
    managerId: 0,
    apartmentName: "",
    apartmentCode: "",
    blockNumber: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Extended With Section
    sectionName: "",
  
    // Extended With Manager
    managerNameSurname: "",
  };
  private _emptyApartmentExtDtoErrors: ApartmentExtDtoErrors = {
    apartmentId: "",
    sectionId: "",
    businessId: "",
    branchId: "",
    managerId: "",
    apartmentName: "",
    apartmentCode: "",
    blockNumber: "",
    createdAt: "",
    updatedAt: "",
    
    // Extended With Section
    sectionName: "",
  
    // Extended With Manager
    managerNameSurname: "",
  };
  
  constructor(
    private http: HttpClient, 
  ) {}

  public get emptyApartmentExtDto(): ApartmentExtDto {
    return cloneDeep(this._emptyApartmentExtDto);
  }

  public get emptyApartmentExtDtoErrors(): ApartmentExtDtoErrors {
    return cloneDeep(this._emptyApartmentExtDtoErrors);
  }
  
  add(apartmentExtDto: ApartmentExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, apartmentExtDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  getByBusinessId(businessId: number): Observable<ListDataResult<ApartmentDto>> {
    return this.http.get<ListDataResult<ApartmentDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }

  getBySectionId(sectionId: number): Observable<ListDataResult<ApartmentDto>> {
    return this.http.get<ListDataResult<ApartmentDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbysectionid/${sectionId}`);
  }

  getExtById(id: number): Observable<SingleDataResult<ApartmentExtDto>> {
    return this.http.get<SingleDataResult<ApartmentExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<ApartmentExtDto>> {
    return this.http.get<ListDataResult<ApartmentExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  update(apartmentExtDto: ApartmentExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/update`, apartmentExtDto);
  }
}
