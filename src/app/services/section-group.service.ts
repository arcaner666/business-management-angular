import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class SectionGroupService {

  private controllerUrl: string = "sectiongroups";
  
  constructor(
    private http: HttpClient, 
  ) {}

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
