import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { AccountTypeDto } from 'src/app/models/dtos/account-type-dto';
import { AccountTypeNamesDto } from 'src/app/models/dtos/account-type-names-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class AccountTypeService {

  private controllerUrl: string = "accounttypes";
  private _emptyAccountTypeNamesDto: AccountTypeNamesDto = {
    accountTypeNames: [],
  };

  constructor(
    private http: HttpClient,
  ) {}

  public get emptyAccountTypeNamesDto(): AccountTypeNamesDto {
    return cloneDeep(this._emptyAccountTypeNamesDto);
  }

  // API İstekleri
  getAll(): Observable<ListDataResult<AccountTypeDto>> {
    return this.http.get<ListDataResult<AccountTypeDto>>(`${environment.apiUrl}/${this.controllerUrl}/getall`);
  }

  getByAccountTypeName(accountTypeName: string): Observable<SingleDataResult<AccountTypeDto>> {
    return this.http.get<SingleDataResult<AccountTypeDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyaccounttypename/${accountTypeName}`);
  }

  getByAccountTypeNames(accountTypeNamesDto: AccountTypeNamesDto): Observable<ListDataResult<AccountTypeDto>> {
    return this.http.post<ListDataResult<AccountTypeDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyaccounttypenames`, accountTypeNamesDto);
  }
}
