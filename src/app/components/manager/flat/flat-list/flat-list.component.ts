import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';

const EMPTY_FLAT_EXT_DTO: FlatExtDto = {
  flatId: 0,
  sectionId: 0,
  apartmentId: 0,
  businessId: 0,
  branchId: 0,
  houseOwnerId: 0,
  tenantId: 0,
  flatCode: "",
  doorNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Section
  sectionName: "",

  // Extended With Apartment
  apartmentName: "",

  // Extended With HouseOwner
  houseOwnerNameSurname: "",

  // Extended With Tenant
  tenantNameSurname: "",
};

@Component({
  selector: 'app-flat-list',
  templateUrl: './flat-list.component.html',
  styleUrls: ['./flat-list.component.scss']
})
export class FlatListComponent {

  @Input() flatExtDtos: FlatExtDto[] = [];

  @Output() deleted = new EventEmitter<FlatExtDto>();
  @Output() selected = new EventEmitter<FlatExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("FlatListComponent constructor çalıştı.");
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
    this.selected.emit(cloneDeep(EMPTY_FLAT_EXT_DTO));
  }
  
  openDeleteModal(selectedFlatExtDto: FlatExtDto): void {
    this.deleted.emit(cloneDeep(selectedFlatExtDto));
  }

  openEditPage(selectedFlatExtDto: FlatExtDto): void {
    this.selected.emit(cloneDeep(selectedFlatExtDto));
  }
}
