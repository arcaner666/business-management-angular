import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';
import { LayoutConfig } from 'src/app/models/various/layout-config';
import { NavGroup } from 'src/app/models/various/nav-group';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-sidebar-floating',
  templateUrl: './sidebar-floating.component.html',
  styleUrls: ['./sidebar-floating.component.scss']
})
export class SidebarFloatingComponent implements OnInit {

  public authorizationDto$: Observable<AuthorizationDto>;
  public sidebarLinks$: Observable<NavGroup[]>;
  public layoutConfig$: Observable<LayoutConfig>;

  constructor(
    private _authorizationService: AuthorizationService,
    private _navigationService: NavigationService,
    private _layoutService: LayoutService,
    private _router: Router,

    public breakpointService: BreakpointService
  ) {
    this._navigationService.loadSidebarLinksByRole();

    this.authorizationDto$ = this._authorizationService.authorizationDtoObservable;
    this.layoutConfig$ = this._layoutService.layoutConfigObservable;
    this.sidebarLinks$ = this._navigationService.sidebarLinks$;
  }

  logout() {
    this._authorizationService.clearAuthorizationDto();
    this._navigationService.loadSidebarLinksByRole();
    this._router.navigate(["public/home"]);
  }

  toggleSidebarFloating() {
    this._layoutService.toggleSidebarFloating();
  }

  ngOnInit(): void {
  }

}
