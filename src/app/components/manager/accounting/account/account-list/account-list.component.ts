import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';

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

  constructor(
    
  ) {
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
    this.selected.emit();
  }
  
  openDeleteModal(selectedAccountExtDto: AccountExtDto): void {
    this.deleted.emit(cloneDeep(selectedAccountExtDto));
  }

  openEditPage(selectedAccountExtDto: AccountExtDto): void {
    this.selected.emit(cloneDeep(selectedAccountExtDto));
  }
}
