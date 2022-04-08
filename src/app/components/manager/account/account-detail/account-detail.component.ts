import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';

const EMPTY_ACCOUNT_EXT_DTO: AccountExtDto = {
  accountId: 0,
  businessId: 0,
  branchId: 0,
  accountGroupId: 0,
  currencyId: 0,
  accountOrder: 0,
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: undefined,
  identityNumber: undefined,
  debitBalance: 0,
  creditBalance: 0,
  balance: 0,
  limit: 0,
  standartMaturity: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Branch
  branchName: "",

  // Extended With AccountGroup
  accountGroupName: "",

  // Extended With Currency
  currencyName: "",

  // Added Custom Fields
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: new Date(),
  gender: "",
  notes: "",
  avatarUrl: "",
};

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() accountGroupDtos: AccountGroupDto[] = [];
  @Input() branchDtos: BranchDto[] = [];
  @Input() cardHeader: string = "";
  @Input() loading: boolean = false;
  @Input() selectedAccountExtDto: AccountExtDto = cloneDeep(EMPTY_ACCOUNT_EXT_DTO);

  @Output() accountCodeGenerated = new EventEmitter<number>();
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<AccountExtDto>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("AccountDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(): void {
    this.submitted = true;

    this.form.controls['branchId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    this.form.controls['branchId'].updateValueAndValidity();

    this.form.controls['accountGroupId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    this.form.controls['accountGroupId'].updateValueAndValidity();

    if (this.form.valid) {
      this.accountCodeGenerated.emit(this.form.controls['accountGroupId'].value);
    }
  }

  save(selectedAccountExtDto: AccountExtDto): void {
    this.submitted = true;

    if (selectedAccountExtDto.accountId == 0) {
      this.validateForAdd(this.form);
    } else {
      this.validateForUpdate(this.form);
    }

    if (this.form.invalid) {
      console.log("Form geçersiz.");
      console.log(this.form);
      return;
    }

    this.saved.emit(selectedAccountExtDto);
  }

  validateForAdd(form: NgForm): void {
    form.controls['nameSurname'].setValidators(Validators.required);
    form.controls['nameSurname'].updateValueAndValidity();

    form.controls['phone'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['phone'].updateValueAndValidity();

    form.controls['branchId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['branchId'].updateValueAndValidity();

    form.controls['accountGroupId'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['accountGroupId'].updateValueAndValidity();

    form.controls['accountName'].setValidators(Validators.required);
    form.controls['accountName'].updateValueAndValidity();
    
    form.controls['accountCode'].setValidators(Validators.required);
    form.controls['accountCode'].updateValueAndValidity();

    if (!form.controls['taxNumber'].value && !form.controls['identityNumber'].value) {
      form.controls['taxNumber'].setValidators([
        Validators.required,
        Validators.min(1)
      ]);
      form.controls['taxNumber'].updateValueAndValidity();

      form.controls['identityNumber'].setValidators([
        Validators.required,
        Validators.min(1)
      ]);
      form.controls['identityNumber'].updateValueAndValidity();
    }

    if (form.controls['taxNumber'].value && !form.controls['taxOffice'].value) {
      form.controls['taxOffice'].setValidators(Validators.required);
      form.controls['taxOffice'].updateValueAndValidity();
    }

    form.controls['limit'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['limit'].updateValueAndValidity();

    form.controls['standartMaturity'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['standartMaturity'].updateValueAndValidity();
  }

  validateForUpdate(form: NgForm): void {
    form.controls['accountName'].setValidators(Validators.required);
    form.controls['accountName'].updateValueAndValidity();
    
    if (!form.controls['taxNumber'].value && !form.controls['identityNumber'].value) {
      form.controls['taxNumber'].setValidators([
        Validators.required,
        Validators.min(1)
      ]);
      form.controls['taxNumber'].updateValueAndValidity();

      form.controls['identityNumber'].setValidators([
        Validators.required,
        Validators.min(1)
      ]);
      form.controls['identityNumber'].updateValueAndValidity();
    }

    if (form.controls['taxNumber'].value && !form.controls['taxOffice'].value) {
      form.controls['taxOffice'].setValidators(Validators.required);
      form.controls['taxOffice'].updateValueAndValidity();
    }

    form.controls['limit'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['limit'].updateValueAndValidity();

    form.controls['standartMaturity'].setValidators([
      Validators.required,
      Validators.min(1)
    ]);
    form.controls['standartMaturity'].updateValueAndValidity();
  }
}
