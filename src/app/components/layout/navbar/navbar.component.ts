import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { cloneDeep } from 'lodash';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';
import { NavGroup } from 'src/app/models/various/nav-group';
import { NavLink } from 'src/app/models/various/nav-link';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { NavigationService } from 'src/app/services/navigation.service';

const EMPTY_AUTHORIZATION_DTO: AuthorizationDto = {
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

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public activeLinkId: number = 0;
  public authorizationDto$: Observable<AuthorizationDto>;
  public isNavbarCollapsed: boolean = true;
  public navbarLinks$: Observable<NavLink[]>;
  public sidebarLinks: NavGroup[] = [];
  
  constructor(
    private _navigationService: NavigationService,
    private _authorizationService: AuthorizationService,

    public breakpointService: BreakpointService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this._navigationService.loadNavbarLinksByRole();
    
    this.authorizationDto$ = this._authorizationService.authorizationDtoObservable;
    this.navbarLinks$ = this._navigationService.navbarLinks$;
  }

  logout() {
    this._authorizationService.clearAuthorizationDto();
    this._navigationService.loadNavbarLinksByRole();
    this.router.navigate(["public/home"]);
  }

  ngOnInit(): void {

  }
}
