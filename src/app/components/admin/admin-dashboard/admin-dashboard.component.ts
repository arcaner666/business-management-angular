import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private _layoutService: LayoutService,
  ) {
    console.log("AdminDashboardComponent constructor çalıştı.");

    // Bu sayfa için layout ayarlarını düzenler.
    this._layoutService.layoutConfig = {
      showNavbar: true,
      showSidebarStatic: false,
      showSidebarFloating: false,
      showFooter: true,
    }; 
  }

  ngOnInit(): void {
  }

}
