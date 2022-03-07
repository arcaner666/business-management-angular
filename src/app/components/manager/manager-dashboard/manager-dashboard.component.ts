import { Component, OnInit } from '@angular/core';

interface Person {
  nameSurname: string;
  phone: string;
  totalDept: number;
};

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {

  public persons: Person[] = [
    {
      nameSurname: "Ümit Kılıç",
      phone: "5334445643",
      totalDept: 160,
    },
    {
      nameSurname: "Umut Büyük",
      phone: "5334323142",
      totalDept: 160,
    },
    {
      nameSurname: "Selda Küçük",
      phone: "5335151612",
      totalDept: 240,
    },
    {
      nameSurname: "Haydar Yıldırım",
      phone: "5334442422",
      totalDept: 80,
    }
  ];

  constructor() {
    console.log("ManagerDashboardComponent constructor çalıştı.");
  }

  ngOnInit(): void {
  }

}
