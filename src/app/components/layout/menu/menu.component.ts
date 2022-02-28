import { Component, OnInit } from '@angular/core';

import { NavLink } from 'src/app/models/various/nav-link';

import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  isNavbarCollapsed: boolean = true;
  links: NavLink[] = [
    { id: 0, title: 'Sidebar Link 1', url: 'public/home', fragment: 'one' },
    { id: 1, title: 'Sidebar Link 2', url: 'public/about', fragment: 'two' },
    { id: 2, title: 'Sidebar Link 3', url: 'public/features', fragment: 'three' },
  ];

  constructor(
    public breakpointService: BreakpointService
  ) { }

  ngOnInit(): void {
  }

}
