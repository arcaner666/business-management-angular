import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';
import { SectionGroupDtoErrors } from 'src/app/models/validation-errors/section-group-dto-errors';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class SectionGroupService {

  private controllerUrl: string = "sectiongroups";
  private _emptySectionGroupDto: SectionGroupDto = {
    sectionGroupId: 0,
    businessId: 0,
    branchId: 0,
    sectionGroupName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  private _emptySectionGroupDtoErrors: SectionGroupDtoErrors = {
    sectionGroupId: "",
    businessId: "",
    branchId: "",
    sectionGroupName: "",
    createdAt: "",
    updatedAt: "",
  };

  constructor(
    private http: HttpClient, 
  ) {}

  public get emptySectionGroupDto(): SectionGroupDto {
    return cloneDeep(this._emptySectionGroupDto);
  }

  public get emptySectionGroupDtoErrors(): SectionGroupDtoErrors {
    return cloneDeep(this._emptySectionGroupDtoErrors);
  }
  
  // API İstekleri
  add(sectionGroupDto: SectionGroupDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/add`, sectionGroupDto);
  }

  delete(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }
  
  getByBusinessId(businessId: number): Observable<ListDataResult<SectionGroupDto>> {
    return this.http.get<ListDataResult<SectionGroupDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }

  getById(id: number): Observable<SingleDataResult<SectionGroupDto>> {
    return this.http.get<SingleDataResult<SectionGroupDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyid/${id}`);
  }

  update(sectionGroupDto: SectionGroupDto): Observable<SingleDataResult<SectionGroupDto>> {
    return this.http.post<SingleDataResult<SectionGroupDto>>(`${environment.apiUrl}/${this.controllerUrl}/update`, sectionGroupDto);
  }
}
