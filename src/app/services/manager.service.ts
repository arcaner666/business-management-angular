import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { ManagerExtDto } from 'src/app/models/dtos/manager-ext-dto';
import { Result } from 'src/app/models/results/result';

const EMPTY_MANAGER_EXT_DTO: ManagerExtDto = {
  managerId: 0,
  businessId: 0,
  branchId: 0,
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: new Date(),
  gender: "",
  notes: "",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Business
  businessName: "",

  // Extended With Branch + FullAddress
  cityId: 0,
  districtId: 0,
  addressText: "",
};

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private controllerUrl: string = "managers";

  constructor(
    private _http: HttpClient,
  ) {}

  // API İstekleri
  addSectionManager(managerExtDto: ManagerExtDto): Observable<Result> {
    return this._http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addsectionmanager`, managerExtDto);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<ManagerExtDto>> {
    return this._http.get<ListDataResult<ManagerExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }
}
