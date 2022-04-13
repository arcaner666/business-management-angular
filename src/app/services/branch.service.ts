import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { BranchCodeDto } from 'src/app/models/dtos/branch-code-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private controllerUrl: string = "branches";

  constructor(
    private http: HttpClient,
  ) {}

  // API İstekleri
  generateBranchCode(businessId: number): Observable<SingleDataResult<BranchCodeDto>> {
    return this.http.get<SingleDataResult<BranchCodeDto>>(`${environment.apiUrl}/${this.controllerUrl}/generatebranchcode/${businessId}`);
  }

  getByBusinessId(businessId: number): Observable<ListDataResult<BranchDto>> {
    return this.http.get<ListDataResult<BranchDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }
}
