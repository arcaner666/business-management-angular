import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';
import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';

@Injectable({
  providedIn: 'root'
})
export class TenantExtService {

  private controllerUrl: string = "tenantexts";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  addExt(tenantExtDto: TenantExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, tenantExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<TenantExtDto>> {
    return this.http.get<SingleDataResult<TenantExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<TenantExtDto>> {
    return this.http.get<ListDataResult<TenantExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(tenantExtDto: TenantExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, tenantExtDto);
  }
}
