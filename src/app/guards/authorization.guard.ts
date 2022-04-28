import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, concatMap, of } from 'rxjs';

import { AuthorizationDto } from 'src/app/models/dtos/authorization-dto';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthorizationGuard implements CanActivate {

  private authorizationDto: AuthorizationDto;
  
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private jwtHelperService: JwtHelperService,
  ) { 
    this.authorizationDto = this.authorizationService.authorizationDto;
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log("AuthorizationGuard çalıştı.");
    return this.authorizationService.authorizationDto$
    .pipe(
      concatMap((authorizationDto) => {
        if (!authorizationDto) {
          console.log("Oturum açılmamış!");
          this.router.navigate(["public/login"]);
          return of(false);
        }

        if (!route.data['roles'] || route.data['roles'].indexOf(authorizationDto.role) == -1) {
          console.log("Gerekli yetkiler yok!");
          this.router.navigate(['public/not-authorized']);
          return of(false);
        }

        if (this.jwtHelperService.isTokenExpired(authorizationDto.accessToken)) {
          console.log("AccessToken'ın süresi bitmiş, yenilemeye çalışılıyor...");
          return this.authorizationService.refreshAccessToken(authorizationDto)
          .pipe(
            concatMap((response) => {
              console.log("AccessToken yenilendi.");
              this.authorizationDto.accessToken = response.data.accessToken;
              this.authorizationService.authorizationDto = this.authorizationDto;
              return of(true);
            }),
            catchError((error) => {
              console.log(error);
              console.log("AccessToken yenilenemedi!");
              this.authorizationService.clearAuthorizationDto();
              this.router.navigate(["public/login"]);
              return of(false);
            })
          )
        }

        return of(true);
      })
    );
  }
}
