import { Component, OnInit } from '@angular/core';

import { NavGroup } from 'src/app/models/various/nav-group';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  isNavbarCollapsed: boolean = true;
  sidebarNavGroups: NavGroup[] = [];

  constructor(
    private _navigationService: NavigationService,

    public breakpointService: BreakpointService,
  ) {
    this.sidebarNavGroups = this._navigationService.sidebarLinks;
  }

  ngOnInit(): void {
  }

}
