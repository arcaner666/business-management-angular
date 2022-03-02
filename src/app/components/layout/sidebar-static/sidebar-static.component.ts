import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { LayoutConfig } from 'src/app/models/various/layout-config';
import { NavGroup } from 'src/app/models/various/nav-group';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-sidebar-static',
  templateUrl: './sidebar-static.component.html',
  styleUrls: ['./sidebar-static.component.scss']
})
export class SidebarStaticComponent implements OnInit {

  public sidebarLinks$: Observable<NavGroup[]>;
  public layoutConfig$: Observable<LayoutConfig>;

  constructor(
    private _navigationService: NavigationService,
    private _layoutService: LayoutService,

    public breakpointService: BreakpointService
  ) {
    this._navigationService.loadSidebarLinksByRole();

    this.layoutConfig$ = this._layoutService.layoutConfigObservable
    this.sidebarLinks$ = this._navigationService.sidebarLinks$;
  }

  ngOnInit(): void {
  }

}
