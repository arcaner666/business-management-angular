import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { BranchCodeDto } from 'src/app/models/dtos/branchCodeDto';
import { BranchDto } from 'src/app/models/dtos/branchDto';
import { BranchExtDto } from 'src/app/models/dtos/branchExtDto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

const EMPTY_BRANCH_DTO: BranchDto = {
  branchId: 0,
  businessId: 0,
  fullAddressId: 0,
  branchOrder: 0,
  branchName: "",
  branchCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const EMPTY_BRANCH_EXT_DTO: BranchExtDto = {
  branchId: 0,
  businessId: 0,
  fullAddressId: 0,
  branchOrder: 0,
  branchName: "",
  branchCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With FullAddress
  cityId: 0,
  districtId: 0,
  addressTitle: "",
  postalCode: 0,
  addressText: "",
};

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private controllerUrl: string = "branches";
  private selectedBranchIdSubject: BehaviorSubject<number>;
  private selectedProcessTypeSubject: BehaviorSubject<number>;

  public selectedBranchId$: Observable<number>;
  public selectedProcessType$: Observable<number>;

  constructor(
    private _http: HttpClient,
  ) {
    this.selectedBranchIdSubject = new BehaviorSubject<number>(0);
    this.selectedProcessTypeSubject = new BehaviorSubject<number>(0);

    this.selectedBranchId$ = this.selectedBranchIdSubject.asObservable();
    this.selectedProcessType$ = this.selectedProcessTypeSubject.asObservable();
  }

  get selectedProcessType(): number {
    return this.selectedProcessTypeSubject.value;
  }

  set selectedProcessType(selectedProcessType: number) {
    this.selectedProcessTypeSubject.next(selectedProcessType);
  }
  
  get selectedBranchId(): number {
    return this.selectedBranchIdSubject.value;
  }

  set selectedBranchId(selectedBranchId: number) {
    this.selectedBranchIdSubject.next(selectedBranchId);
  }

  // API İstekleri
  addExt(branchExtDto: BranchExtDto): Observable<Result> {
    return this._http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, branchExtDto);
  }

  delete(id: number): Observable<Result> {
    return this._http.get<Result>(`${environment.apiUrl}/${this.controllerUrl}/delete/${id}`);
  }

  generateBranchCode(businessId: number): Observable<SingleDataResult<BranchCodeDto>> {
    return this._http.get<SingleDataResult<BranchCodeDto>>(`${environment.apiUrl}/${this.controllerUrl}/generatebranchcode/${businessId}`);
  }

  getByBranchCode(branchCode: string): Observable<SingleDataResult<BranchDto>> {
    return this._http.get<SingleDataResult<BranchDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybranchcode/${branchCode}`);
  }

  getByBusinessId(businessId: number): Observable<ListDataResult<BranchDto>> {
    return this._http.get<ListDataResult<BranchDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }

  getById(id: number): Observable<SingleDataResult<BranchDto>> {
    return this._http.get<SingleDataResult<BranchDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyid/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<BranchExtDto>> {
    return this._http.get<SingleDataResult<BranchExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<BranchExtDto>> {
    return this._http.get<ListDataResult<BranchExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  updateExt(branchExtDto: BranchExtDto): Observable<Result> {
    return this._http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, branchExtDto);
  }
}
