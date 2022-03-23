import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { ManagerExtDto } from 'src/app/models/dtos/manager-ext-dto';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private controllerUrl: string = "managers";

  constructor(
    private _http: HttpClient,
  ) {}

  // API İstekleri
  getExtsByBusinessId(businessId: number): Observable<ListDataResult<ManagerExtDto>> {
    return this._http.get<ListDataResult<ManagerExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }
}
