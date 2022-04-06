import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private controllerUrl: string = "sections";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  addExt(sectionExtDto: SectionExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, sectionExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
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

  updateExt(sectionExtDto: SectionExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, sectionExtDto);
  }
}
