import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class ApartmentExtService {

  private controllerUrl: string = "apartmentexts";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  addExt(apartmentExtDto: ApartmentExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, apartmentExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<ApartmentExtDto>> {
    return this.http.get<SingleDataResult<ApartmentExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<ApartmentExtDto>> {
    return this.http.get<ListDataResult<ApartmentExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(apartmentExtDto: ApartmentExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, apartmentExtDto);
  }
}
