import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';
import { SectionGroupDtoErrors } from 'src/app/models/validation-errors/section-group-dto-errors';

@Component({
  selector: 'app-section-group-detail',
  templateUrl: './section-group-detail.component.html',
  styleUrls: ['./section-group-detail.component.scss']
})
export class SectionGroupDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader: string = "";
  @Input() selectedSectionGroupDto!: SectionGroupDto;
  @Input() selectedSectionGroupDtoErrors!: SectionGroupDtoErrors;
  @Input() loading: boolean = false;

  @Output() saved = new EventEmitter<SectionGroupDto>();
  @Output() cancelled = new EventEmitter();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("SectionGroupDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedSectionGroupDto: SectionGroupDto): void {
    this.submitted = true;
    this.saved.emit(selectedSectionGroupDto);
  }
}
