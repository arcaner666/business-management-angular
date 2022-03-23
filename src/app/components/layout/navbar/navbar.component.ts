import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthorizationDto } from 'src/app/models/dtos/authorization-dto';
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
    private navigationService: NavigationService,
    private authorizationService: AuthorizationService,
    private layoutService: LayoutService,

    public breakpointService: BreakpointService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.navigationService.loadSidebarLinksByRole();
    
    this.authorizationDto$ = this.authorizationService.authorizationDto$;
    this.layoutConfig$ = this.layoutService.layoutConfigObservable;
    this.sidebarLinks$ = this.navigationService.sidebarLinks$;
  }

  toggleSidebarFloating(): void {
    this.layoutService.toggleSidebarFloating();
  }

  logout(): void {
    this.authorizationService.logout().subscribe();
    this.authorizationService.clearAuthorizationDto();
    this.navigationService.loadSidebarLinksByRole();
    this.router.navigate(["public/home"]);
    if (this.breakpointService.screenSize.width < 576) {
      this.layoutService.toggleSidebarFloating();
    }
  }

  ngOnInit(): void {

  }
}
