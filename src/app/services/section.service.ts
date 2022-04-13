import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { Result } from 'src/app/models/results/result';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private controllerUrl: string = "sections";
  
  constructor(
    private http: HttpClient, 
  ) {}

  // API İstekleri
  getByBusinessId(businessId: number): Observable<ListDataResult<SectionDto>> {
    return this.http.get<ListDataResult<SectionDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbybusinessid/${businessId}`);
  }
}
