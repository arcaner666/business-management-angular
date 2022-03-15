import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { BranchExtDto } from 'src/app/models/dtos/branchExtDto';
import { CityDto } from 'src/app/models/dtos/cityDto';
import { DistrictDto } from 'src/app/models/dtos/districtDto';

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

  @Input() cardHeader: string = "";
  @Input() cityDtos: CityDto[] = [];
  @Input() districtDtos: DistrictDto[] = [];
  @Input() selectedBranchExtDto: BranchExtDto = cloneDeep(EMPTY_BRANCH_EXT_DTO);
  @Input() loading: boolean = false;

  @Output() branchSaved = new EventEmitter<BranchExtDto>();
  @Output() branchCancelled = new EventEmitter();
  @Output() branchCodeGenerated = new EventEmitter();
  @Output() citySelected = new EventEmitter<number>();
  
  @ViewChild('branchExtForm') branchExtForm!: NgForm;

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("BranchDetailComponent constructor çalıştı.");
  }

  cancelBranch() {
    this.branchCancelled.emit();
  }

  generateBranchCode() {
    this.branchCodeGenerated.emit();
  }

  saveBranch(selectedBranchExtDto: BranchExtDto){
    this.submitted = true;

    this.validateBranch(this.branchExtForm);

    if (this.branchExtForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.branchExtForm);
      return;
    }

    this.branchSaved.emit(selectedBranchExtDto);
    
    this.loading = true;
  }

  selectCity(cityId: number){
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedBranchExtDto.districtId = 0;
    
    this.citySelected.emit(cityId);
  }

  selectDistrict(districtId: number){
    this.selectedBranchExtDto.districtId = districtId;
  }

  validateBranch(form: NgForm) {
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
}
