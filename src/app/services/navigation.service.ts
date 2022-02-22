import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Role } from 'src/app/models/various/role';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private _router: Router
  ) {}

  // Role göre kullanıcıyı yönlendir.
  navigateByRole(role: Role) {
    if(role) {
      switch (role) {
        case "Admin": this._router.navigate(['admin/dashboard']); break;
        case "Manager": this._router.navigate(['manager/dashboard']); break;
        case "Customer": this._router.navigate(['customer/dashboard']); break;
        default: this._router.navigate(['/']); break;
      }
    } 
  }
}
