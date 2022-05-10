import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { CashExtDto } from 'src/app/models/dtos/cash-ext-dto';

@Component({
  selector: 'app-cash-list',
  templateUrl: './cash-list.component.html',
  styleUrls: ['./cash-list.component.scss']
})
export class CashListComponent {

  @Input() cashExtDtos: CashExtDto[] = [];

  @Output() deleted = new EventEmitter<CashExtDto>();
  @Output() selected = new EventEmitter<CashExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("CashListComponent constructor çalıştı.");
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
  
  openDeleteModal(selectedCashExtDto: CashExtDto): void {
    this.deleted.emit(cloneDeep(selectedCashExtDto));
  }

  openEditPage(selectedCashExtDto: CashExtDto): void {
    this.selected.emit(cloneDeep(selectedCashExtDto));
  }
}
