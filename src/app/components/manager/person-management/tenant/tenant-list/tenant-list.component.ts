import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';

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
    this.selected.emit();
  }
  
  openDeleteModal(selectedTenantExtDto: TenantExtDto): void {
    this.deleted.emit(cloneDeep(selectedTenantExtDto));
  }

  openEditPage(selectedTenantExtDto: TenantExtDto): void {
    this.selected.emit(cloneDeep(selectedTenantExtDto));
  }
}
