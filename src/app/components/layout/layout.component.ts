import { Component, HostListener, OnInit } from '@angular/core';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private _breakpointSevice: BreakpointService,

    public layoutService: LayoutService
  ) {
    this._breakpointSevice.screenSize.width = window.screen.width;
    this._breakpointSevice.screenSize.height = window.screen.height;
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this._breakpointSevice.screenSize.width = window.innerWidth;
    this._breakpointSevice.screenSize.height = window.innerHeight;
  }
}
