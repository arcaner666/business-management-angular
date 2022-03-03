import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private layoutService: LayoutService
  ) {
    // Bu sayfa için layout ayarlarını düzenler.
    this.layoutService.layoutConfig = {
      showNavbar: true,
      showSidebarStatic: false,
      showSidebarFloating: false,
      showFooter: true,
    };
  }

  ngOnInit(): void {
  }

}
