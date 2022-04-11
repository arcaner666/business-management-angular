import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';

import { cloneDeep } from 'lodash';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { AccountType } from 'src/app/models/various/account-type';
import { BranchDto } from 'src/app/models/dtos/branch-dto';

const ACCOUNT_EXT_DTO_ERRORS: AccountExtDtoErrors = {
  accountId: "",
  businessId: "",
  branchId: "",
  accountGroupId: "",
  currencyId: "",
  accountOrder: "",
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: "",
  identityNumber: "",
  debitBalance: "",
  creditBalance: "",
  balance: "",
  limit: "",
  standartMaturity: "",
  createdAt: "",
  updatedAt: "",

  // Extended With Branch
  branchName: "",

  // Extended With AccountGroup
  accountGroupName: "",
  accountGroupCode: "",

  // Extended With Currency
  currencyName: "",

  // Added Custom Fields
  accountTypeName: "",
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  notes: "",
  avatarUrl: "",
};

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
  accountGroupCode: "",

  // Extended With Currency
  currencyName: "",

  // Added Custom Fields
  accountTypeName: "",
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: new Date(),
  gender: "",
  notes: "",
  avatarUrl: "",
};

const SECTION_MANAGER_ACCOUNT_TYPES: AccountType[] = [
  {
    accountTypeName: "Diğer",
  },
  {
    accountTypeName: "Personel",
  },
  {
    accountTypeName: "Ev Sahibi",
  },
  {
    accountTypeName: "Kiracı",
  },
];

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() selectedAccountExtDtoErrors: AccountExtDtoErrors = cloneDeep(ACCOUNT_EXT_DTO_ERRORS);
  @Input() accountGroupDtos: AccountGroupDto[] = [];
  @Input() branchDtos: BranchDto[] = [];
  @Input() cardHeader: string = "";
  @Input() loading: boolean = false;
  @Input() selectedAccountExtDto: AccountExtDto = cloneDeep(EMPTY_ACCOUNT_EXT_DTO);
  
  @Output() accountCodeGenerated = new EventEmitter<number>();
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<AccountExtDto>();
  
  public sectionManagerAccountTypes: AccountType[] = cloneDeep(SECTION_MANAGER_ACCOUNT_TYPES);
  public selectedAccountTypeName: string = "Diğer";
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
    this.accountCodeGenerated.emit(this.selectedAccountExtDto.accountGroupId);
  }

  reset() {
    this.submitted = false;
    this.selectedAccountExtDto = cloneDeep(EMPTY_ACCOUNT_EXT_DTO);
    // this.selectedAccountExtDto.accountId = 0;
    // this.selectedAccountExtDto.businessId = 0;
    // this.selectedAccountExtDto.branchId = 0;
    // this.selectedAccountExtDto.accountGroupId = 0;
    // this.selectedAccountExtDto.currencyId = 0;
    // this.selectedAccountExtDto.accountOrder = 0;
    // this.selectedAccountExtDto.accountName = "";
    // this.selectedAccountExtDto.accountCode = "";
    // this.selectedAccountExtDto.taxOffice = "";
    // this.selectedAccountExtDto.taxNumber = undefined;
    // this.selectedAccountExtDto.identityNumber = undefined;
    // this.selectedAccountExtDto.debitBalance = 0;
    // this.selectedAccountExtDto.creditBalance = 0;
    // this.selectedAccountExtDto.balance = 0;
    // this.selectedAccountExtDto.limit = 0;
    // this.selectedAccountExtDto.standartMaturity = 0;
    // this.selectedAccountExtDto.createdAt = new Date();
    // this.selectedAccountExtDto.updatedAt = new Date();
    // this.selectedAccountExtDto.branchName = "";
    // this.selectedAccountExtDto.accountGroupName = "";
    // this.selectedAccountExtDto.accountGroupCode = "";
    // this.selectedAccountExtDto.currencyName = "";
    // this.selectedAccountExtDto.nameSurname = "";
    // this.selectedAccountExtDto.email = "";
    // this.selectedAccountExtDto.phone = "";
    // this.selectedAccountExtDto.dateOfBirth = new Date();
    // this.selectedAccountExtDto.gender = "";
    // this.selectedAccountExtDto.notes = "";
    // this.selectedAccountExtDto.avatarUrl = "";
  }

  save(selectedAccountExtDto: AccountExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedAccountExtDto);
  }

  selectAccountGroup() {
    this.selectedAccountExtDto.accountCode = "";
    this.selectedAccountExtDto.accountOrder = 0;
  }

  selectAccountType(selectedAccountTypeName: string) {
    this.reset();
    let selectedAccountTypeInArray = [];
    if (selectedAccountTypeName == "Ev Sahibi") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "120");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
    } else if (selectedAccountTypeName == "Kiracı") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "120");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
    } else if (selectedAccountTypeName == "Personel") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "335");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
    } else if (selectedAccountTypeName == "Diğer") {
      this.selectedAccountExtDto.accountGroupId = 0;
    }
  }

  validateForAdd(form: NgForm): void {
    // form.controls['accountTypeId'].setValidators([
    //   Validators.required,
    //   Validators.min(1)
    // ]);
    // form.controls['accountTypeId'].updateValueAndValidity();

    // if (this.selectedAccountTypeName && this.selectedAccountTypeName != 'Diğer') {
    //   form.controls['nameSurname'].setValidators(Validators.required);
    //   form.controls['nameSurname'].updateValueAndValidity();
  
    //   form.controls['phone'].setValidators([
    //     Validators.required,
    //     Validators.minLength(10),
    //     Validators.maxLength(10),
    //   ]);
    //   form.controls['phone'].updateValueAndValidity();
    // }

    // form.controls['branchId'].setValidators([
    //   Validators.required,
    //   Validators.min(1)
    // ]);
    // form.controls['branchId'].updateValueAndValidity();

    // form.controls['accountGroupId'].setValidators([
    //   Validators.required,
    //   Validators.min(1)
    // ]);
    // form.controls['accountGroupId'].updateValueAndValidity();

    // form.controls['accountName'].setValidators(Validators.required);
    // form.controls['accountName'].updateValueAndValidity();
    
    // form.controls['accountCode'].setValidators(Validators.required);
    // form.controls['accountCode'].updateValueAndValidity();

    // form.controls['identityNumber'].setValidators([
    //   Validators.required,
    //   Validators.min(10000000000),
    //   Validators.max(99999999999),
    // ]);
    // form.controls['identityNumber'].updateValueAndValidity();

    // form.controls['limit'].setValidators([
    //   Validators.required,
    //   Validators.min(1)
    // ]);
    // form.controls['limit'].updateValueAndValidity();

    // form.controls['standartMaturity'].setValidators([
    //   Validators.required,
    //   Validators.min(1)
    // ]);
    // form.controls['standartMaturity'].updateValueAndValidity();
  }

  validateForUpdate(form: NgForm): void {
    form.controls['accountName'].setValidators(Validators.required);
    form.controls['accountName'].updateValueAndValidity();
    
    form.controls['identityNumber'].setValidators([
      Validators.required,
      Validators.min(10000000000),
      Validators.max(99999999999),
    ]);
    form.controls['identityNumber'].updateValueAndValidity();

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
