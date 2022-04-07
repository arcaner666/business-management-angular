import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';

const EMPTY_BRANCH_EXT_DTO: BranchExtDto = {
  branchId: 0,
  businessId: 0,
  fullAddressId: 0,
  branchOrder: 0,
  branchName: "",
  branchCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With FullAddress
  cityId: 0,
  districtId: 0,
  addressTitle: "",
  postalCode: 0,
  addressText: "",
};

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss']
})
export class BranchDetailComponent {

  @ViewChild('form') form!: NgForm;

  @Input() cardHeader: string = "";
  @Input() cityDtos: CityDto[] = [];
  @Input() districtDtos: DistrictDto[] = [];
  @Input() selectedBranchExtDto: BranchExtDto = cloneDeep(EMPTY_BRANCH_EXT_DTO);
  @Input() loading: boolean = false;

  @Output() saved = new EventEmitter<BranchExtDto>();
  @Output() branchCodeGenerated = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() citySelected = new EventEmitter<number>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("BranchDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateBranchCode(): void {
    this.branchCodeGenerated.emit();
  }

  save(selectedBranchExtDto: BranchExtDto): void {
    this.submitted = true;

    if (selectedBranchExtDto.branchId == 0) {
      this.validateForAdd(this.form);
    } else {
      this.validateForUpdate(this.form);
    }

    if (this.form.invalid) {
      console.log("Form geçersiz.");
      console.log(this.form);
      return;
    }

    this.saved.emit(selectedBranchExtDto);
  }

  selectCity(cityId: number): void {
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedBranchExtDto.districtId = 0;
    
    this.citySelected.emit(cityId);
  }

  validateForAdd(form: NgForm): void {
    form.controls['branchName'].setValidators(Validators.required);
    form.controls['branchName'].updateValueAndValidity();
    
    form.controls['branchCode'].setValidators(Validators.required);
    form.controls['branchCode'].updateValueAndValidity();

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

    form.controls['addressTitle'].setValidators(Validators.required);
    form.controls['addressTitle'].updateValueAndValidity();

    form.controls['postalCode'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['postalCode'].updateValueAndValidity();

    form.controls['addressText'].setValidators(Validators.required);
    form.controls['addressText'].updateValueAndValidity();
  }

  validateForUpdate(form: NgForm): void {
    form.controls['branchName'].setValidators(Validators.required);
    form.controls['branchName'].updateValueAndValidity();

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

    form.controls['addressTitle'].setValidators(Validators.required);
    form.controls['addressTitle'].updateValueAndValidity();

    form.controls['postalCode'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['postalCode'].updateValueAndValidity();

    form.controls['addressText'].setValidators(Validators.required);
    form.controls['addressText'].updateValueAndValidity();
  }
}
