import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  constructor(
    private layoutService: LayoutService,
  ) {
    console.log("ManagerDashboardComponent constructor çalıştı.");

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
