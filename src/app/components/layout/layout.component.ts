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
    
    this.setScreenSize();
    this.selectLayout();
    
    // Oturum durumu değiştiğinde selectLayout() metodunun tekrar tetiklenmesi gerekiyor.
    this.subscribeAuthorizationChanges();
  }

  setScreenSize() {
    this.breakpointService.screenSize.width = window.innerWidth;
    this.breakpointService.screenSize.height = window.innerHeight;
  }

  selectLayout() {
    if (this.breakpointService.screenSize.width >= 992 && this.authorizationService.authorizationDto?.role) {
      this.layoutService.layoutConfig.layoutType = "sidebar-static";
    } else if (this.breakpointService.screenSize.width < 992) {
      this.layoutService.layoutConfig.layoutType = "sidebar-floating";
    } else if (this.breakpointService.screenSize.width >= 992 && !this.authorizationService.authorizationDto?.role) {
      this.layoutService.layoutConfig.layoutType = "only-content";
    } else {
      this.layoutService.layoutConfig.layoutType = "only-content";
    }
  }
  subscribeAuthorizationChanges() {
    this.authorizationService.authorizationDtoObservable.subscribe({
      next: () => {
        this.selectLayout();
      }
    });
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setScreenSize();
    this.selectLayout();
  }
}
