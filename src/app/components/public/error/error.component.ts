import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  constructor(
    private layoutService: LayoutService
  ) {
    console.log("ErrorComponent constructor çalıştı.");

    this.layoutService.layoutConfig.blank = true;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.layoutService.resetLayoutConfig();
  }

}
