import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';

const EMPTY_ACCOUNT_EXT_DTO: AccountExtDto = {
  accountId: 0,
  businessId: 0,
  branchId: 0,
  accountGroupId: 0,
  currencyId: 0,
  accountOrder: 0,
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: undefined,
  identityNumber: undefined,
  debitBalance: 0,
  creditBalance: 0,
  balance: 0,
  limit: 0,
  standartMaturity: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Branch
  branchName: "",

  // Extended With AccountGroup
  accountGroupName: "",
  accountGroupCode: "",

  // Extended With Currency
  currencyName: "",

  // Added Custom Fields
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: new Date(),
  gender: "",
  notes: "",
  avatarUrl: "",
};

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {

  @Input() accountExtDtos: AccountExtDto[] = [];

  @Output() deleted = new EventEmitter<AccountExtDto>();
  @Output() selected = new EventEmitter<AccountExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("AccountListComponent constructor çalıştı.");
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
    this.selected.emit(cloneDeep(EMPTY_ACCOUNT_EXT_DTO));
  }
  
  openDeleteModal(selectedAccountExtDto: AccountExtDto): void {
    this.deleted.emit(cloneDeep(selectedAccountExtDto));
  }

  openEditPage(selectedAccountExtDto: AccountExtDto): void {
    this.selected.emit(cloneDeep(selectedAccountExtDto));
  }
}
