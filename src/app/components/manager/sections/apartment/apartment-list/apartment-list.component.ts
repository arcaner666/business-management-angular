import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';

const EMPTY_APARTMENT_EXT_DTO: ApartmentExtDto = {
  apartmentId: 0,
  sectionId: 0,
  businessId: 0,
  branchId: 0,
  managerId: 0,
  apartmentName: "",
  apartmentCode: "",
  blockNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  
  // Extended With Section
  sectionName: "",

  // Extended With Manager
  managerNameSurname: "",
};

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
    this.selected.emit(cloneDeep(EMPTY_APARTMENT_EXT_DTO));
  }
  
  openDeleteModal(selectedApartmentExtDto: ApartmentExtDto): void {
    this.deleted.emit(cloneDeep(selectedApartmentExtDto));
  }

  openEditPage(selectedApartmentExtDto: ApartmentExtDto): void {
    this.selected.emit(cloneDeep(selectedApartmentExtDto));
  }
}
