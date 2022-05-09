import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { HouseOwnerDto } from 'src/app/models/dtos/house-owner-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class HouseOwnerService {

  private controllerUrl: string = "houseowners";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  getByAccountId(accountId: number): Observable<SingleDataResult<HouseOwnerDto>> {
    return this.http.get<SingleDataResult<HouseOwnerDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyaccountid/${accountId}`);
  }

  getByBusinessId(businessId: number): Observable<ListDataResult<HouseOwnerDto>> {
    return this.http.get<ListDataResult<HouseOwnerDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }
}
