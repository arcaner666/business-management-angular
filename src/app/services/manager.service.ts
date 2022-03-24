import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private controllerUrl: string = "managers";

  constructor(
    private http: HttpClient,
  ) {}

  // API İstekleri
  getByBusinessId(businessId: number): Observable<ListDataResult<ManagerDto>> {
    return this.http.get<ListDataResult<ManagerDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }
}
