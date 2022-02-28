import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NavLink } from 'src/app/models/various/nav-link'; 

import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  activeLinkId: number = 0;
  isNavbarCollapsed: boolean = true;
  links: NavLink[] = [
    { id: 0, title: 'Anasayfa', url: 'public/home', fragment: 'one' },
    { id: 1, title: 'Biz Kimiz?', url: 'public/about', fragment: 'two' },
    { id: 2, title: 'Ne Sağlıyoruz?', url: 'public/features', fragment: 'three' },
    { id: 3, title: 'Referanslarımız', url: 'public/references', fragment: 'four' },
    { id: 4, title: 'Paketlerimiz', url: 'public/pricing', fragment: 'five' },
    { id: 5, title: 'Bize Ulaşın', url: 'public/contact', fragment: 'six' },
  ];
  
  constructor(
    public route: ActivatedRoute,
    public breakpointService: BreakpointService
  ) {
  }

  ngOnInit(): void {
  }

}
