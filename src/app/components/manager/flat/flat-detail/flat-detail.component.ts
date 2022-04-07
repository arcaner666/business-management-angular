import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { HouseOwnerDto } from 'src/app/models/dtos/house-owner-dto';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { TenantDto } from 'src/app/models/dtos/tenant-dto';

const EMPTY_FLAT_EXT_DTO: FlatExtDto = {
  flatId: 0,
  sectionId: 0,
  apartmentId: 0,
  businessId: 0,
  branchId: 0,
  houseOwnerId: 0,
  tenantId: 0,
  flatCode: "",
  doorNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Section
  sectionName: "",

  // Extended With Apartment
  apartmentName: "",

  // Extended With HouseOwner
  houseOwnerNameSurname: "",

  // Extended With Tenant
  tenantNameSurname: "",
};

@Component({
  selector: 'app-flat-detail',
  templateUrl: './flat-detail.component.html',
  styleUrls: ['./flat-detail.component.scss']
})
export class FlatDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() apartmentDtos: ApartmentDto[] = [];
  @Input() cardHeader: string = "";
  @Input() houseOwnerDtos: HouseOwnerDto[] = [];
  @Input() loading: boolean = false;
  @Input() sectionDtos: SectionDto[] = [];
  @Input() selectedFlatExtDto: FlatExtDto = cloneDeep(EMPTY_FLAT_EXT_DTO);
  @Input() tenantDtos: TenantDto[] = [];

  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<FlatExtDto>();
  @Output() sectionSelected = new EventEmitter<number>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("FlatDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedFlatExtDto: FlatExtDto): void {
    this.submitted = true;

    if (selectedFlatExtDto.flatId == 0) {
      this.validateForAdd(this.form);
    } else {
      this.validateForUpdate(this.form);
    }

    if (this.form.invalid) {
      console.log("Form geçersiz.");
      console.log(this.form);
      return;
    }

    this.saved.emit(selectedFlatExtDto);
  }

  selectSection(sectionId: number): void {
    // Site listesi her yenilendiğinde apartman listesi de yenilenmeli.
    this.selectedFlatExtDto.apartmentId = 0;

    this.sectionSelected.emit(sectionId);
  }

  validateForAdd(form: NgForm): void {
    form.controls['sectionId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['sectionId'].updateValueAndValidity();

    form.controls['apartmentId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['apartmentId'].updateValueAndValidity();
    
    form.controls['doorNumber'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['doorNumber'].updateValueAndValidity();
  }

  validateForUpdate(form: NgForm): void {
    form.controls['doorNumber'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['doorNumber'].updateValueAndValidity();
  }
}
