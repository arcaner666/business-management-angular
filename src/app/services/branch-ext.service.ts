import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class BranchExtService {

  private controllerUrl: string = "branchexts";

  constructor(
    private http: HttpClient,
  ) {}

  // API İstekleri
  addExt(branchExtDto: BranchExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/addext`, branchExtDto);
  }

  deleteExt(id: number): Observable<Result> {
    return this.http.delete<Result>(`${environment.apiUrl}/${this.controllerUrl}/deleteext/${id}`);
  }

  getExtById(id: number): Observable<SingleDataResult<BranchExtDto>> {
    return this.http.get<SingleDataResult<BranchExtDto>>(`${environment.apiUrl}/${this.controllerUrl}/getextbyid/${id}`);
  }

  updateExt(branchExtDto: BranchExtDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/updateext`, branchExtDto);
  }
}
