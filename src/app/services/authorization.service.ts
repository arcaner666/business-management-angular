import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { environment } from 'src/environments/environment';

import { AuthorizationDto } from 'src/app/models/dtos/authorization-dto';
import { RegisterSectionManagerDto } from 'src/app/models/dtos/register-section-manager-dto';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/single-data-result';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private controllerUrl: string = "authorization";
  private authorizationDtoSubject: BehaviorSubject<AuthorizationDto>;
  private _emptyAuthorizationDto: AuthorizationDto = {
    systemUserId: 0,
    email: "",
    phone: "",
    role: "",
    businessId: 0,
    branchId: 0,
    blocked: false,
    refreshToken: "",
    refreshTokenExpiryTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  
    // Extended
    password: "",
    refreshTokenDuration: 0,
    accessToken: "",
  };
  private _emptyRegisterSectionManagerDto: RegisterSectionManagerDto = {
    nameSurname: "",
    phone: "",
    businessName: "",
    cityId: 0,
    districtId: 0,
    addressText: "",
    taxOffice: "",
    taxNumber: 0,
    identityNumber: 0,
  };

  public authorizationDto$: Observable<AuthorizationDto>;

  constructor(
    private http: HttpClient,
  ) {
    this.authorizationDtoSubject = new BehaviorSubject<AuthorizationDto>(JSON.parse(localStorage.getItem('authorizationDto')!));
    this.authorizationDto$ = this.authorizationDtoSubject.asObservable();
  }

  // Kullanıcıyı localStorage'dan ve auth service'den silmek için kısayol.
  clearAuthorizationDto(): void {
    localStorage.removeItem('authorizationDto');
    this.authorizationDtoSubject.next(cloneDeep(this._emptyAuthorizationDto));
  }

  // Kullanıcıyı dış component'lerden almak için kısayol.
  public get authorizationDto(): AuthorizationDto {
    return this.authorizationDtoSubject.value;
  }

  // Kullanıcıyı değiştirmek için bir kısayol.
  public set authorizationDto(authorizationDto: AuthorizationDto){
    localStorage.setItem("authorizationDto", JSON.stringify(authorizationDto));
    this.authorizationDtoSubject.next(authorizationDto);
  }

  public get emptyAuthorizationDto(): AuthorizationDto {
    return cloneDeep(this._emptyAuthorizationDto);
  }

  public get emptyRegisterSectionManagerDto(): RegisterSectionManagerDto {
    return cloneDeep(this._emptyRegisterSectionManagerDto);
  }

  // API İstekleri
  loginWithEmail(authorizationDto: AuthorizationDto): Observable<SingleDataResult<AuthorizationDto>> {
    return this.http.post<SingleDataResult<AuthorizationDto>>(`${environment.apiUrl}/${this.controllerUrl}/loginwithemail`, authorizationDto);
  }

  loginWithPhone(authorizationDto: AuthorizationDto): Observable<SingleDataResult<AuthorizationDto>> {
    return this.http.post<SingleDataResult<AuthorizationDto>>(`${environment.apiUrl}/${this.controllerUrl}/loginwithphone`, authorizationDto);
  }

  logout(): Observable<Result> {
    return this.http.get<Result>(`${environment.apiUrl}/${this.controllerUrl}/logout`);
  }

  refreshAccessToken(authorizationDto: AuthorizationDto): Observable<SingleDataResult<AuthorizationDto>> {
    return this.http.post<SingleDataResult<AuthorizationDto>>(`${environment.apiUrl}/${this.controllerUrl}/refreshaccesstoken`, authorizationDto);
  }

  // RegisterSectionManagerDto şuan için kullanıldı fakat RegisterCompanyManagerDto ile değiştirilecek.
  registerCompanyManager(registerSectionManagerDto: RegisterSectionManagerDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/registercompanymanager`, registerSectionManagerDto);
  }

  registerSectionManager(registerSectionManagerDto: RegisterSectionManagerDto): Observable<Result> {
    return this.http.post<Result>(`${environment.apiUrl}/${this.controllerUrl}/registersectionmanager`, registerSectionManagerDto);
  }
}
