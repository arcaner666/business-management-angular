import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { BranchDto } from 'src/app/models/dtos/branch-dto';

const EMPTY_BRANCH_DTO: BranchDto = {
  branchId: 0,
  businessId: 0,
  fullAddressId: 0,
  branchOrder: 0,
  branchName: "",
  branchCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent {

  @Input() branchDtos: BranchDto[] = [];

  @Output() branchDeleted = new EventEmitter<BranchDto>();
  @Output() branchSelected = new EventEmitter<BranchDto>();

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

  openAddBranchPage(): void {
    this.branchSelected.emit(cloneDeep(EMPTY_BRANCH_DTO));
  }
  
  openDeleteBranchModal(selectedBranchDto: BranchDto): void {
    this.branchDeleted.emit(cloneDeep(selectedBranchDto));
  }

  openEditBranchPage(selectedBranchDto: BranchDto): void {
    this.branchSelected.emit(cloneDeep(selectedBranchDto));
  }
}
