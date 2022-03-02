import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';
import { LayoutConfig } from 'src/app/models/various/layout-config';
import { NavGroup } from 'src/app/models/various/nav-group';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public activeLinkId: number = 0;
  public authorizationDto$: Observable<AuthorizationDto>;
  public isSidebarCollapsed: boolean = true;
  public sidebarLinks$: Observable<NavGroup[]>;
  public layoutConfig$: Observable<LayoutConfig>;
  
  constructor(
    private _navigationService: NavigationService,
    private _authorizationService: AuthorizationService,
    private _layoutService: LayoutService,

    public breakpointService: BreakpointService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this._navigationService.loadSidebarLinksByRole();
    
    this.authorizationDto$ = this._authorizationService.authorizationDtoObservable;
    this.layoutConfig$ = this._layoutService.layoutConfigObservable;
    this.sidebarLinks$ = this._navigationService.sidebarLinks$;
  }

  toggleSidebarFloating() {
    this._layoutService.toggleSidebarFloating();
  }

  logout() {
    this._authorizationService.clearAuthorizationDto();
    this._navigationService.loadSidebarLinksByRole();
    this.router.navigate(["public/home"]);
  }

  ngOnInit(): void {

  }
}
