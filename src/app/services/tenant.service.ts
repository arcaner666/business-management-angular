import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { TenantDto } from 'src/app/models/dtos/tenant-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private controllerUrl: string = "tenants";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  getByBusinessId(businessId: number): Observable<ListDataResult<TenantDto>> {
    return this.http.get<ListDataResult<TenantDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }
}
