import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';

const EMPTY_SECTION_EXT_DTO: SectionExtDto = {
  sectionId: 0,
  sectionGroupId: 0,
  businessId: 0,
  branchId: 0,
  managerId: 0,
  fullAddressId: 0,
  sectionName: "",
  sectionCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With SectionGroup
  sectionGroupName: "",

  // Extended With Manager
  managerNameSurname: "",

  // Extended With FullAddress
  cityId: 0,
  districtId: 0,
  addressTitle: "",
  postalCode: 0,
  addressText: "",

  // Extended With FullAddress + City
  cityName: "",

  // Extended With FullAddress + District
  districtName: "",
};

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})
export class SectionListComponent {

  @Input() sectionExtDtos: SectionExtDto[] = [];

  @Output() deleted = new EventEmitter<SectionExtDto>();
  @Output() selected = new EventEmitter<SectionExtDto>();

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;

  constructor() {
    console.log("SectionListComponent constructor çalıştı.");
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
    this.selected.emit(cloneDeep(EMPTY_SECTION_EXT_DTO));
  }
  
  openDeleteModal(selectedSectionExtDto: SectionExtDto): void {
    this.deleted.emit(cloneDeep(selectedSectionExtDto));
  }

  openEditPage(selectedSectionExtDto: SectionExtDto): void {
    this.selected.emit(cloneDeep(selectedSectionExtDto));
  }
}
