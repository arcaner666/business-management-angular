import { Component, OnInit } from '@angular/core';

import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent implements OnInit {

  constructor(
    private _layoutService: LayoutService
  ) {
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
