import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { EmployeeExtDto } from 'src/app/models/dtos/employee-ext-dto';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {

  @Input() employeeExtDtos: EmployeeExtDto[] = [];

  @Output() deleted = new EventEmitter<EmployeeExtDto>();
  @Output() selected = new EventEmitter<EmployeeExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("EmployeeListComponent constructor çalıştı.");
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
  
  openDeleteModal(selectedEmployeeExtDto: EmployeeExtDto): void {
    this.deleted.emit(cloneDeep(selectedEmployeeExtDto));
  }

  openEditPage(selectedEmployeeExtDto: EmployeeExtDto): void {
    this.selected.emit(cloneDeep(selectedEmployeeExtDto));
  }
}
