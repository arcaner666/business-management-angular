import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthorizationService } from 'src/app/services/authorization.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Bu yapı API'ye yaptığımız isteklerin sonucunda dönen hataları yakalayarak 
      // arayüze geri döndürüyor.
      catchError(err => {
        console.log(err);
        if (err.error?.message == "TokenInvalid" || err.error?.message == "CanNotGetPrincipal") {
          this.authorizationService.clearAuthorizationDto();
          this.router.navigate(['public/not-authorized', 'public/login']);
        }
        // catchError backend'den dönen hatayı ekstra bir hata katmanıyla sarmalıyor.
        // Backend'den dönen yanıta erişmek için err.error dememiz gerekiyor.
        return throwError(err.error);
      })
    );
  }
}
