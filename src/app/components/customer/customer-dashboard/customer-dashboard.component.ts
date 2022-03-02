import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit {

  constructor(
    private _layoutService: LayoutService,
  ) { 
    console.log("CustomerDashboardComponent constructor çalıştı.");

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
