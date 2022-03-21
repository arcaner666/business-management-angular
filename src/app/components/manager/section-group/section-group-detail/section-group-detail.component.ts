import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

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
  selector: 'app-section-group-detail',
  templateUrl: './section-group-detail.component.html',
  styleUrls: ['./section-group-detail.component.scss']
})
export class SectionGroupDetailComponent {

  @ViewChild('sectionGroupForm') sectionGroupForm!: NgForm;
  
  @Input() cardHeader: string = "";
  @Input() selectedSectionGroupDto: SectionGroupDto = cloneDeep(EMPTY_SECTION_GROUP_DTO);
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

    this.validate(this.sectionGroupForm);

    if (this.sectionGroupForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.sectionGroupForm);
      return;
    }

    this.saved.emit(selectedSectionGroupDto);
  }

  validate(form: NgForm): void {
    form.controls['sectionGroupName'].setValidators(Validators.required);
    form.controls['sectionGroupName'].updateValueAndValidity();
  }
}
