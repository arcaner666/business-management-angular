import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';

const EMPTY_HOUSE_OWNER_EXT_DTO: HouseOwnerExtDto = {
  houseOwnerId: 0,
  businessId: 0,
  branchId: 0,
  accountId: 0,
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: undefined,
  gender: "",
  notes: "",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Account
  accountGroupId: 0,
  accountOrder: 0,
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: 0,
  identityNumber: 0,
  limit: 0,
  standartMaturity: 0,
};

@Component({
  selector: 'app-house-owner-list',
  templateUrl: './house-owner-list.component.html',
  styleUrls: ['./house-owner-list.component.scss']
})
export class HouseOwnerListComponent {

  @Input() houseOwnerExtDtos: HouseOwnerExtDto[] = [];

  @Output() deleted = new EventEmitter<HouseOwnerExtDto>();
  @Output() selected = new EventEmitter<HouseOwnerExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("HouseOwnerListComponent constructor çalıştı.");
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
    this.selected.emit(cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO));
  }
  
  openDeleteModal(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.deleted.emit(cloneDeep(selectedHouseOwnerExtDto));
  }

  openEditPage(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.selected.emit(cloneDeep(selectedHouseOwnerExtDto));
  }
}
