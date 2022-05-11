import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { BankExtDto } from 'src/app/models/dtos/bank-ext-dto';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent {

  @Input() bankExtDtos: BankExtDto[] = [];

  @Output() deleted = new EventEmitter<BankExtDto>();
  @Output() selected = new EventEmitter<BankExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("BankListComponent constructor çalıştı.");
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
  
  openDeleteModal(selectedBankExtDto: BankExtDto): void {
    this.deleted.emit(cloneDeep(selectedBankExtDto));
  }

  openEditPage(selectedBankExtDto: BankExtDto): void {
    this.selected.emit(cloneDeep(selectedBankExtDto));
  }
}
