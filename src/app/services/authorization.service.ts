import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/singleDataResult';
import { Role } from '../models/various/role';

const EMPTY_AUTHORIZATION_DTO: AuthorizationDto = {
  systemUserId: BigInt(0),
  email: "",
  phone: "",
  role2: "",
  dateOfBirth: new Date(),
  businessId: 0,
  branchId: BigInt(0),
  blocked: false,
  refreshToken: "",
  refreshTokenExpiryTime: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended
  password: "",
  refreshTokenDuration: 0,
  accessToken: "",
  role: Role.Anonymous,
};

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private controllerUrl: string = "authorization";
  private authorizationDtoSubject: BehaviorSubject<AuthorizationDto>;

  public authorizationDtoObservable: Observable<AuthorizationDto>;

  constructor(
    private _http: HttpClient,
  ) {
    this.authorizationDtoSubject = new BehaviorSubject<AuthorizationDto>(JSON.parse(localStorage.getItem('authorizationDto')!));
    this.authorizationDtoObservable = this.authorizationDtoSubject.asObservable();
  }

  // Kullanıcıyı localStorage'dan ve auth service'den silmek için kısayol.
  clearAuthorizationDto(): void {
    localStorage.removeItem('authorizationDto');
    this.authorizationDtoSubject.next(cloneDeep(EMPTY_AUTHORIZATION_DTO));
  }

  // Boş kullanıcıyı dış component'lerden almak için kısayol.
  get emptyAuthorizationDto(): AuthorizationDto {
    return cloneDeep(EMPTY_AUTHORIZATION_DTO);
  }

  // Kullanıcıyı dış component'lerden almak için kısayol.
  get authorizationDto(): AuthorizationDto {
    return this.authorizationDtoSubject.value;
  }

  // Kullanıcıyı değiştirmek için bir kısayol.
  set authorizationDto(authorizationDto: AuthorizationDto){
    localStorage.setItem("authorizationDto", JSON.stringify(authorizationDto));
    this.authorizationDtoSubject.next(authorizationDto);
  }

  // API İstekleri
  loginWithEmail(authorizationDto: AuthorizationDto): Observable<SingleDataResult<AuthorizationDto>> {
    return this._http.post<SingleDataResult<AuthorizationDto>>(`${environment.apiUrl}/${this.controllerUrl}/loginwithemail`, authorizationDto);
  }

  loginWithPhone(authorizationDto: AuthorizationDto): Observable<SingleDataResult<AuthorizationDto>> {
    return this._http.post<SingleDataResult<AuthorizationDto>>(`${environment.apiUrl}/${this.controllerUrl}/loginwithphone`, authorizationDto);
  }

  logout(): Observable<Result> {
    return this._http.get<Result>(`${environment.apiUrl}/${this.controllerUrl}/logout`);
  }

  refreshAccessToken(authorizationDto: AuthorizationDto): Observable<SingleDataResult<AuthorizationDto>> {
    return this._http.post<SingleDataResult<AuthorizationDto>>(`${environment.apiUrl}/${this.controllerUrl}/refreshaccesstoken`, authorizationDto);
  }
}
