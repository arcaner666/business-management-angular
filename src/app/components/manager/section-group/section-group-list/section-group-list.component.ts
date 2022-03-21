import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';

const EMPTY_SECTION_GROUP_DTO: SectionGroupDto = {
  sectionGroupId: 0,
  businessId: 0,
  branchId: 0,
  sectionGroupName: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Component({
  selector: 'app-section-group-list',
  templateUrl: './section-group-list.component.html',
  styleUrls: ['./section-group-list.component.scss']
})
export class SectionGroupListComponent {

  @Input() sectionGroupDtos: SectionGroupDto[] = [];

  @Output() sectionGroupDeleted = new EventEmitter<SectionGroupDto>();
  @Output() sectionGroupSelected = new EventEmitter<SectionGroupDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("SectionGroupListComponent constructor çalıştı.");
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

  openAddSectionGroupPage(): void {
    this.sectionGroupSelected.emit(cloneDeep(EMPTY_SECTION_GROUP_DTO));
  }
  
  openDeleteSectionGroupModal(selectedSectionGroupDto: SectionGroupDto): void {
    this.sectionGroupDeleted.emit(cloneDeep(selectedSectionGroupDto));
  }

  openEditSectionGroupPage(selectedSectionGroupDto: SectionGroupDto): void {
    this.sectionGroupSelected.emit(cloneDeep(selectedSectionGroupDto));
  }
}
