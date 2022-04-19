import { Component, EventEmitter, Input, Output } from '@angular/core';

import { cloneDeep } from 'lodash';

import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';

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
    this.selected.emit();
  }
  
  openDeleteModal(selectedSectionExtDto: SectionExtDto): void {
    this.deleted.emit(cloneDeep(selectedSectionExtDto));
  }

  openEditPage(selectedSectionExtDto: SectionExtDto): void {
    this.selected.emit(cloneDeep(selectedSectionExtDto));
  }
}
