import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';
import { TenantDto } from 'src/app/models/dtos/tenant-dto';

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
