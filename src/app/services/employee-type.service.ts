import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { EmployeeTypeDto } from 'src/app/models/dtos/employee-type-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTypeService {

  private controllerUrl: string = "employeetypes";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  getAll(): Observable<ListDataResult<EmployeeTypeDto>> {
    return this.http.get<ListDataResult<EmployeeTypeDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }
}
