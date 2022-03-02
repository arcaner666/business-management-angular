import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  constructor(
    private _layoutService: LayoutService,
  ) {
    console.log("ManagerDashboardComponent constructor çalıştı.");

    // Bu sayfa için layout ayarlarını düzenler.
    this._layoutService.layoutConfig = {
      showNavbar: true,
      showSidebarStatic: false,
      showSidebarFloating: false,
      showFooter: true,
    };
  }

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  openNav() {
    document.getElementById("mySidenav")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById("mySidenav")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
  }

  ngOnInit(): void {
  }

}
