import { Component, HostListener, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';
import { LayoutConfig } from 'src/app/models/various/layout-config';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  public authorizationDto$: Observable<AuthorizationDto>;
  public layoutConfig$: Observable<LayoutConfig>;

  constructor(
    private authorizationService: AuthorizationService,

    public layoutService: LayoutService,
    public breakpointService: BreakpointService,
  ) {
    this.authorizationDto$ = this.authorizationService.authorizationDtoObservable;
    this.layoutConfig$ = this.layoutService.layoutConfigObservable;
    
    this.breakpointService.screenSize.width = window.screen.width;
    this.breakpointService.screenSize.height = window.screen.height;
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.breakpointService.screenSize.width = window.innerWidth;
    this.breakpointService.screenSize.height = window.innerHeight;

    // Eğer ekran yeterince büyükse statik sidebar'ı gösterir.
    if (this.breakpointService.screenSize.width >= 992 && this.authorizationService.authorizationDto) {
      this.layoutService.layoutConfig = {
        showNavbar: true,
        showSidebarStatic: true,
        showSidebarFloating: false,
        showFooter: true,
      };
    } else {
      this.layoutService.layoutConfig = {
        showNavbar: true,
        showSidebarStatic: false,
        showSidebarFloating: false,
        showFooter: true,
      };
    }
  }
}
