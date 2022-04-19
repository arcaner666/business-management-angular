import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';

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
    this.selected.emit();
  }
  
  openDeleteModal(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.deleted.emit(cloneDeep(selectedHouseOwnerExtDto));
  }

  openEditPage(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.selected.emit(cloneDeep(selectedHouseOwnerExtDto));
  }
}
