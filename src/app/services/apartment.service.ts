import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private controllerUrl: string = "apartments";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  getByBusinessId(businessId: number): Observable<ListDataResult<ApartmentDto>> {
    return this.http.get<ListDataResult<ApartmentDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }

  getBySectionId(sectionId: number): Observable<ListDataResult<ApartmentDto>> {
    return this.http.get<ListDataResult<ApartmentDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbysectionid/${sectionId}`);
  }
}
