import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(
    private layoutService: LayoutService
  ) {
    // Bu sayfa için layout ayarlarını düzenler.
    this.layoutService.layoutConfig = {
      showNavbar: false,
      showSidebarStatic: false,
      showSidebarFloating: false,
      showFooter: false,
    };
  }

  ngOnInit(): void {
  }

}
