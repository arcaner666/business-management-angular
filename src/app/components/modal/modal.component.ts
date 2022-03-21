import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  @Input() modalTitle: string = "";
  @Input() modalItem: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
