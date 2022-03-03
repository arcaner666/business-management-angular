import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  constructor() {
    console.log("ManagerDashboardComponent constructor çalıştı.");
  }

  ngOnInit(): void {
  }

}
