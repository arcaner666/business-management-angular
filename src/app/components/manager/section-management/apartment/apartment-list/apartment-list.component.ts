import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.scss']
})
export class ApartmentListComponent {

  @Input() apartmentExtDtos: ApartmentExtDto[] = [];

  @Output() deleted = new EventEmitter<ApartmentExtDto>();
  @Output() selected = new EventEmitter<ApartmentExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("ApartmentListComponent constructor çalıştı.");
  }

  // Paginator'daki değişiklikleri tabloya uygular.
  onPageChange(currentPage: number): void {
    this.pageSize = this.itemsPerPage * (currentPage - 1);
    if(currentPage == 1){
      this.elementIndex = 0;
    } else {
      this.elementIndex = (currentPage - 1) * this.itemsPerPage;
    }
  }

  openAddPage(): void {
    this.selected.emit();
  }
  
  openDeleteModal(selectedApartmentExtDto: ApartmentExtDto): void {
    this.deleted.emit(cloneDeep(selectedApartmentExtDto));
  }

  openEditPage(selectedApartmentExtDto: ApartmentExtDto): void {
    this.selected.emit(cloneDeep(selectedApartmentExtDto));
  }
}
