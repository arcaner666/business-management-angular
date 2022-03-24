import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private controllerUrl: string = "districts";

  constructor(
    private http: HttpClient,
  ) {}

  // API İstekleri
  getAll(): Observable<ListDataResult<DistrictDto>> {
    return this.http.get<ListDataResult<DistrictDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }

  getByCityId(cityId: number): Observable<ListDataResult<DistrictDto>> {
    return this.http.get<ListDataResult<DistrictDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbycityid/${cityId}`);
  }
}
