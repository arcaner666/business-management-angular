import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthorizationGuard implements CanActivate {

  private authorizationDto: AuthorizationDto;
  private authorizationDto$: Observable<AuthorizationDto>;
  private canActivateSubject: BehaviorSubject<boolean>;
  private canActivate$: Observable<boolean>;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private _jwtHelperService: JwtHelperService,
  ) {
    this.authorizationDto$ = this.authorizationService.authorizationDto$;
    this.authorizationDto = this.authorizationService.authorizationDto;
    this.subscribeAutorizationDtoChanges();
    this.canActivateSubject = new BehaviorSubject<boolean>(false);
    this.canActivate$ = this.canActivateSubject.asObservable();
  }

  subscribeAutorizationDtoChanges(){
    this.authorizationDto$.subscribe({
      next: (response) => {
        this.authorizationDto = response;
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log("AuthGuard çalıştı.");
    // Oturum açılmışsa;
    if (this.authorizationDto) {
      // Gidilmek istenen route için gerekli yetkiler varsa;
      if (route.data['roles'] && route.data['roles'].indexOf(this.authorizationDto.role) != -1) {
        // Eğer access token'ın süresi bittiyse;
        if (this._jwtHelperService.isTokenExpired(this.authorizationDto.accessToken)) {
          console.log("AccessToken'ın süresi bitmiş, yenilemeye çalışılıyor...");
          // Yenilemeye çalış.
          this.authorizationService.refreshAccessToken(this.authorizationDto).subscribe({
            next: (response) => {
              if (response.success) {
                // Token yenileme isteğinden dönen authorizationDto'da yalnızca accessToken var. Dikkat!
                console.log("AccessToken yenilendi.");
                this.canActivateSubject.next(true);
                this.authorizationDto.accessToken = response.data.accessToken;
                this.authorizationService.authorizationDto = this.authorizationDto;
              }
            }, error: (error) => {
              console.log("RefreshToken'ın süresi bitmiş, AccessToken yenilenemedi, giriş sayfasına yönlendiriliyor...");
              this.canActivateSubject.next(false);
              this.authorizationService.clearAuthorizationDto();
              this.router.navigate(["public/login"]);
            }
          });
        }
        // Eğer access token hala geçerliyse;
        else {
          this.canActivateSubject.next(true);
        }
      } 
      // Gidilmek istenen route için gerekli yetkiler yoksa;
      else {
        console.log("AuthGuard gerekli yetkiler yok!");
        this.canActivateSubject.next(false);
        this.router.navigate(['public/not-authorized']);
      }
    } 
    // Oturum açılmamışsa;
    else {
      console.log("AuthGuard oturum açılmamış!");
      this.canActivateSubject.next(false);
      this.router.navigate(["public/login"]);
    }
    return this.canActivate$;
  }
}
