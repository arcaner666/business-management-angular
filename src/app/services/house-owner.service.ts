import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { HouseOwnerDto } from 'src/app/models/dtos/house-owner-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

@Injectable({
  providedIn: 'root'
})
export class HouseOwnerService {

  private controllerUrl: string = "houseowners";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  getByBusinessId(businessId: number): Observable<ListDataResult<HouseOwnerDto>> {
    return this.http.get<ListDataResult<HouseOwnerDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }
}
