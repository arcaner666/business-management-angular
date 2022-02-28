import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private _router: Router
  ) {}

  // Role göre kullanıcıyı yönlendir.
  navigateByRole(role: string) {
    if(role) {
      switch (role) {
        case "Admin": this._router.navigate(['admin/admin-dashboard']); break;
        case "Manager": this._router.navigate(['manager/manager-dashboard']); break;
        case "Customer": this._router.navigate(['customer/customer-dashboard']); break;
        default: this._router.navigate(['/']); break;
      }
    } 
  }
}
