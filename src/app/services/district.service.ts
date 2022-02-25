import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { DistrictDto } from 'src/app/models/dtos/districtDto';
import { ListDataResult } from 'src/app/models/results/listDataResult';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private controllerUrl: string = "districts";

  constructor(
    private _http: HttpClient,
  ) {}

  // API İstekleri
  getAll(): Observable<ListDataResult<DistrictDto>> {
    return this._http.get<ListDataResult<DistrictDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }

  getByCityId(cityId: number): Observable<ListDataResult<DistrictDto>> {
    return this._http.get<ListDataResult<DistrictDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbycityid/${cityId}`);
  }
}
