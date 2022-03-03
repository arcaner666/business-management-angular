import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { firstValueFrom  } from 'rxjs';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthorizationGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationService,
    private _router: Router,
    private _jwtHelperService: JwtHelperService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const authorizationDto = this.authorizationService.authorizationDto;
    console.log("AuthGuard çalıştı.");
    if (authorizationDto) {
      // Gidilmek istenen route için gerekli yetkiler var mı kontrol edilir.
      // Burası en üstte olmalı.
      if (route.data['roles'] && route.data['roles'].indexOf(authorizationDto.role) == -1) {
        // Gerekli yetkiler yoksa oturum açılma durumuna göre kullanıcıların not-authorized 
        // sayfasından kendi ana sayfalarına yönlendirecek URL bilgileri parametre olarak
        // gönderilir.
        switch (authorizationDto.role) {
          case "Admin": this._router.navigate(['public/not-authorized', 'admin/dashboard']); break;
          case "Manager": this._router.navigate(['public/not-authorized', 'manager/dashboard']); break;
          case "Customer": this._router.navigate(['public/not-authorized', 'customer/dashboard']); break;
          default: break;
        }
        return false;
      }

      // Eğer access token'ın süresi bittiyse
      if (this._jwtHelperService.isTokenExpired(authorizationDto.accessToken)) {
        console.log("AccessToken'ın süresi bitmiş, yenilemeye çalışılıyor...");
        // Yenilemeye çalış.
        let refreshResult = await this.tryRefreshAccessToken(authorizationDto);
        // Yenilenmiyorsa kullanıcı bilgilerini temizle giriş sayfasına yönlendir.
        if(!refreshResult) {
          // REFRESH TOKEN'IN SÜRESİ BİTTİĞİNDE YENİLEME YAPAMADIYSA LOGİNE YÖNLENDİRİYOR
          // FAKAT TEMAYI BOZUYOR. DÜZELT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          console.log("RefreshToken'ın süresi bitmiş, AccessToken yenilenemedi, giriş sayfasına yönlendiriliyor...");
          this.authorizationService.clearAuthorizationDto();
          this._router.navigate(["public/login"]);
          //window.location.assign("public/login");
        }
        return refreshResult;
      }
      return true;
    }

    // Eğer oturum açılmadıysa giriş sayfasına yönlendir.  
    this._router.navigate(['public/login']);
    return false;
  }

  async tryRefreshAccessToken(authorizationDto: AuthorizationDto): Promise<boolean> {
    let isRefreshSuccessful: boolean = false;
    try {
      let response = await firstValueFrom(this.authorizationService.refreshAccessToken(authorizationDto));
      if(response.success) {
        isRefreshSuccessful = true;
        // Token yenileme isteğinden dönen authorizationDto'da yalnızca accessToken var. Dikkat!
        authorizationDto.accessToken = response.data.accessToken;
        // Yenilenmiş kullanıcı bilgilerini kaydet.
        this.authorizationService.authorizationDto = authorizationDto;
        console.log("AccessToken yenilendi.");
      }
    } catch (error) {
      isRefreshSuccessful = false;
    }
    return isRefreshSuccessful;
  }

}
