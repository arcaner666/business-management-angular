import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionDto } from 'src/app/models/dtos/section-dto';

const EMPTY_APARTMENT_DTO: ApartmentDto = {
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
  @Input() selectedApartmentDto: ApartmentDto = cloneDeep(EMPTY_APARTMENT_DTO);

  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<ApartmentDto>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("ApartmentDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedApartmentDto: ApartmentDto): void {
    this.submitted = true;

    this.validate(this.form);

    if (this.form.invalid) {
      console.log("Form geçersiz.");
      console.log(this.form);
      return;
    }

    this.saved.emit(selectedApartmentDto);
  }

  selectManager(managerId: number): void {
    this.selectedApartmentDto.managerId = managerId;
  }

  selectSection(sectionId: number): void {
    this.selectedApartmentDto.sectionId = sectionId;
  }

  validate(form: NgForm): void {
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
}
