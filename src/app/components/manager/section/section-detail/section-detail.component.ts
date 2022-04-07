import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';

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
  selector: 'app-section-detail',
  templateUrl: './section-detail.component.html',
  styleUrls: ['./section-detail.component.scss']
})
export class SectionDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader: string = "";
  @Input() cityDtos: CityDto[] = [];
  @Input() districtDtos: DistrictDto[] = [];
  @Input() loading: boolean = false;
  @Input() managerDtos: ManagerDto[] = [];
  @Input() sectionGroupDtos: SectionGroupDto[] = [];
  @Input() selectedSectionExtDto: SectionExtDto = cloneDeep(EMPTY_SECTION_EXT_DTO);

  @Output() cancelled = new EventEmitter();
  @Output() citySelected = new EventEmitter<number>();
  @Output() saved = new EventEmitter<SectionExtDto>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("SectionDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedSectionExtDto: SectionExtDto): void {
    this.submitted = true;

    if (selectedSectionExtDto.sectionId == 0) {
      this.validateForAdd(this.form);
    } else {
      this.validateForUpdate(this.form);
    }

    if (this.form.invalid) {
      console.log("Form geçersiz.");
      console.log(this.form);
      return;
    }

    this.saved.emit(selectedSectionExtDto);
  }

  selectCity(cityId: number): void {
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedSectionExtDto.districtId = 0;
    
    this.citySelected.emit(cityId);
  }

  validateForAdd(form: NgForm): void {
    form.controls['sectionName'].setValidators(Validators.required);
    form.controls['sectionName'].updateValueAndValidity();
    
    form.controls['sectionGroupId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['sectionGroupId'].updateValueAndValidity();

    form.controls['managerId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['managerId'].updateValueAndValidity();

    form.controls['cityId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['cityId'].updateValueAndValidity();

    form.controls['districtId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['districtId'].updateValueAndValidity();

    form.controls['postalCode'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['postalCode'].updateValueAndValidity();

    form.controls['addressText'].setValidators(Validators.required);
    form.controls['addressText'].updateValueAndValidity();
  }

  validateForUpdate(form: NgForm): void {
    form.controls['sectionName'].setValidators(Validators.required);
    form.controls['sectionName'].updateValueAndValidity();
    
    form.controls['sectionGroupId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['sectionGroupId'].updateValueAndValidity();

    form.controls['managerId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['managerId'].updateValueAndValidity();

    form.controls['cityId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['cityId'].updateValueAndValidity();

    form.controls['districtId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['districtId'].updateValueAndValidity();

    form.controls['postalCode'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['postalCode'].updateValueAndValidity();

    form.controls['addressText'].setValidators(Validators.required);
    form.controls['addressText'].updateValueAndValidity();
  }
}
