import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';

const EMPTY_TENANT_EXT_DTO: TenantExtDto = {
  tenantId: 0,
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
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent {

  @Input() tenantExtDtos: TenantExtDto[] = [];

  @Output() deleted = new EventEmitter<TenantExtDto>();
  @Output() selected = new EventEmitter<TenantExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("TenantListComponent constructor çalıştı.");
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
    this.selected.emit(cloneDeep(EMPTY_TENANT_EXT_DTO));
  }
  
  openDeleteModal(selectedTenantExtDto: TenantExtDto): void {
    this.deleted.emit(cloneDeep(selectedTenantExtDto));
  }

  openEditPage(selectedTenantExtDto: TenantExtDto): void {
    this.selected.emit(cloneDeep(selectedTenantExtDto));
  }
}
