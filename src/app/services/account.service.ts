import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AccountCodeDto } from 'src/app/models/dtos/account-code-dto';
import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountGetByAccountGroupCodesDto } from 'src/app/models/dtos/account-get-by-account-group-codes-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private controllerUrl: string = "accounts";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  addExt(accountExtDto: AccountExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, accountExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  generateAccountCode(businessId: number, branchId: number, accountGroupCode: string): Observable<SingleDataResult<AccountCodeDto>> {
    return this.http.get<SingleDataResult<AccountCodeDto>>(`${environment.apiUrl}/${this.controllerUrl}/generateaccountcode/${businessId}/${branchId}/${accountGroupCode}`);
  }

  getExtById(id: number): Observable<SingleDataResult<AccountExtDto>> {
    return this.http.get<SingleDataResult<AccountExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  getExtsByBusinessId(businessId: number): Observable<ListDataResult<AccountExtDto>> {
    return this.http.get<ListDataResult<AccountExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessid/${businessId}`);
  }

  getExtsByBusinessIdAndAccountGroupCode(accountGetByAccountGroupCodesDto: AccountGetByAccountGroupCodesDto): Observable<ListDataResult<AccountExtDto>> {
    return this.http.post<ListDataResult<AccountExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextsbybusinessidandaccountgroupcode`, accountGetByAccountGroupCodesDto);
  }

  updateExt(accountExtDto: AccountExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, accountExtDto);
  }
}
