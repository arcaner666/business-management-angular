import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor() {
    console.log("ErrorComponent constructor çalıştı.");
  }

  ngOnInit(): void {
  }

}
