import { LayoutService } from './../../services/layout.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    public _layoutService: LayoutService
  ) { }

  ngOnInit(): void {
  }

}
