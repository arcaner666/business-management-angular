import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { CityDto } from 'src/app/models/dtos/city-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private controllerUrl: string = "cities";

  constructor(
    private http: HttpClient,
  ) {}

  // API İstekleri
  getAll(): Observable<ListDataResult<CityDto>> {
    return this.http.get<ListDataResult<CityDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }
}
