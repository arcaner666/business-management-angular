import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BranchDto } from 'src/app/models/dtos/branchDto';

@Component({
  selector: 'app-branch2-list',
  templateUrl: './branch2-list.component.html',
  styleUrls: ['./branch2-list.component.scss']
})
export class Branch2ListComponent {

  @Input() branchDtos: BranchDto[] = [];
  @Output() branchSelected = new EventEmitter<number>();
  @Output() branchDeleted = new EventEmitter<number>();
  @Output() processTypeSelected = new EventEmitter<number>();

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
    this.branchSelected.emit(0);
  }

  openEditBranchPage(selectedBranchDto: BranchDto): void {
    this.branchSelected.emit(selectedBranchDto.branchId);
  }

  openDeleteBranchModal(selectedBranchDto: BranchDto) {
    this.branchDeleted.emit(selectedBranchDto.branchId);
  }
}
