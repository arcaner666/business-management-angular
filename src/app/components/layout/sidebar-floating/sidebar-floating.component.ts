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
    private authorizationService: AuthorizationService,
    private navigationService: NavigationService,
    private layoutService: LayoutService,
    private router: Router,

    public breakpointService: BreakpointService
  ) {
    this.navigationService.loadSidebarLinksByRole();

    this.authorizationDto$ = this.authorizationService.authorizationDtoObservable;
    this.layoutConfig$ = this.layoutService.layoutConfigObservable;
    this.sidebarLinks$ = this.navigationService.sidebarLinks$;
  }

  logout() {
    this.authorizationService.clearAuthorizationDto();
    this.navigationService.loadSidebarLinksByRole();
    this.toggleSidebarFloating();
    this.router.navigate(["public/home"]);
  }

  toggleSidebarFloating() {
    this.layoutService.toggleSidebarFloating();
  }

  ngOnInit(): void {
  }

}
