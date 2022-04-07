import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionDto } from 'src/app/models/dtos/section-dto';

const EMPTY_APARTMENT_EXT_DTO: ApartmentExtDto = {
  apartmentId: 0,
  sectionId: 0,
  businessId: 0,
  branchId: 0,
  managerId: 0,
  apartmentName: "",
  apartmentCode: "",
  blockNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  
  // Extended With Section
  sectionName: "",

  // Extended With Manager
  managerNameSurname: "",
};

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.scss']
})
export class ApartmentDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader: string = "";
  @Input() loading: boolean = false;
  @Input() managerDtos: ManagerDto[] = [];
  @Input() sectionDtos: SectionDto[] = [];
  @Input() selectedApartmentExtDto: ApartmentExtDto = cloneDeep(EMPTY_APARTMENT_EXT_DTO);

  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<ApartmentExtDto>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("ApartmentDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedApartmentExtDto: ApartmentExtDto): void {
    this.submitted = true;

    if (selectedApartmentExtDto.apartmentId == 0) 
      this.validateForAdd(this.form);
    else
      this.validateForUpdate(this.form);

    if (this.form.invalid) {
      console.log("Form geçersiz.");
      console.log(this.form);
      return;
    }

    this.saved.emit(selectedApartmentExtDto);
  }

  validateForAdd(form: NgForm): void {
    form.controls['sectionId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['sectionId'].updateValueAndValidity();

    form.controls['managerId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['managerId'].updateValueAndValidity();

    form.controls['apartmentName'].setValidators(Validators.required);
    form.controls['apartmentName'].updateValueAndValidity();
    
    form.controls['blockNumber'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['blockNumber'].updateValueAndValidity();
  }

  validateForUpdate(form: NgForm): void {
    form.controls['managerId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['managerId'].updateValueAndValidity();

    form.controls['apartmentName'].setValidators(Validators.required);
    form.controls['apartmentName'].updateValueAndValidity();
    
    form.controls['blockNumber'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['blockNumber'].updateValueAndValidity();
  }
}
