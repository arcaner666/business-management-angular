import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class HouseOwnerExtService {

  private controllerUrl: string = "houseownerexts";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  addExt(houseOwnerExtDto: HouseOwnerExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, houseOwnerExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<HouseOwnerExtDto>> {
    return this.http.get<SingleDataResult<HouseOwnerExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<HouseOwnerExtDto>> {
    return this.http.get<ListDataResult<HouseOwnerExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(houseOwnerExtDto: HouseOwnerExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, houseOwnerExtDto);
  }
}
