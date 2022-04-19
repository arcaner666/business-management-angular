import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';

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
    this.selected.emit();
  }
  
  openDeleteModal(selectedFlatExtDto: FlatExtDto): void {
    this.deleted.emit(cloneDeep(selectedFlatExtDto));
  }

  openEditPage(selectedFlatExtDto: FlatExtDto): void {
    this.selected.emit(cloneDeep(selectedFlatExtDto));
  }
}
