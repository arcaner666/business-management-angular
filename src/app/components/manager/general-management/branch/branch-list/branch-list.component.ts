import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent {

  @Input() branchExtDtos: BranchExtDto[] = [];

  @Output() deleted = new EventEmitter<BranchExtDto>();
  @Output() selected = new EventEmitter<BranchExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("BranchListComponent constructor çalıştı.");
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
  
  openDeleteModal(selectedBranchExtDto: BranchExtDto): void {
    this.deleted.emit(cloneDeep(selectedBranchExtDto));
  }

  openEditPage(selectedBranchExtDto: BranchExtDto): void {
    this.selected.emit(cloneDeep(selectedBranchExtDto));
  }
}
