import { Component, OnInit } from '@angular/core';

import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    public _breakpointService: BreakpointService
  ) { }

  ngOnInit(): void {
  }

}
