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
  
  @Output() accountCodeGenerated = new EventEmitter<AccountExtDto>();
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<AccountExtDto>();
  
  public sectionManagerAccountTypes: AccountType[] = cloneDeep(SECTION_MANAGER_ACCOUNT_TYPES);
  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("AccountDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(selectedAccountExtDto: AccountExtDto): void {
    this.submitted = true;
    this.accountCodeGenerated.emit(selectedAccountExtDto);
  }

  reset() {
    this.submitted = false;
    this.selectedAccountExtDto.accountId = 0;
    this.selectedAccountExtDto.businessId = 0;
    this.selectedAccountExtDto.branchId = 0;
    this.selectedAccountExtDto.accountGroupId = 0;
    this.selectedAccountExtDto.currencyId = 0;
    this.selectedAccountExtDto.accountOrder = 0;
    this.selectedAccountExtDto.accountName = "";
    this.selectedAccountExtDto.accountCode = "";
    this.selectedAccountExtDto.taxOffice = "";
    this.selectedAccountExtDto.taxNumber = undefined;
    this.selectedAccountExtDto.identityNumber = undefined;
    this.selectedAccountExtDto.debitBalance = 0;
    this.selectedAccountExtDto.creditBalance = 0;
    this.selectedAccountExtDto.balance = 0;
    this.selectedAccountExtDto.limit = 0;
    this.selectedAccountExtDto.standartMaturity = 0;
    this.selectedAccountExtDto.createdAt = new Date();
    this.selectedAccountExtDto.updatedAt = new Date();
    this.selectedAccountExtDto.branchName = "";
    this.selectedAccountExtDto.accountGroupName = "";
    this.selectedAccountExtDto.accountGroupCode = "";
    this.selectedAccountExtDto.currencyName = "";
    this.selectedAccountExtDto.nameSurname = "";
    this.selectedAccountExtDto.email = "";
    this.selectedAccountExtDto.phone = "";
    this.selectedAccountExtDto.dateOfBirth = new Date();
    this.selectedAccountExtDto.gender = "";
    this.selectedAccountExtDto.notes = "";
    this.selectedAccountExtDto.avatarUrl = "";
  }

  save(selectedAccountExtDto: AccountExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedAccountExtDto);
  }

  selectAccountGroup() {
    this.selectedAccountExtDto.accountCode = "";
    this.selectedAccountExtDto.accountOrder = 0;
  }

  selectAccountType(accountTypeName: string) {
    this.reset();
    let selectedAccountTypeInArray = [];
    if (accountTypeName == "Ev Sahibi") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "120");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
      this.selectedAccountExtDto.accountTypeName = "Ev Sahibi";
    } else if (accountTypeName == "Kiracı") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "120");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
      this.selectedAccountExtDto.accountTypeName = "Kiracı";
    } else if (accountTypeName == "Personel") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "335");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
      this.selectedAccountExtDto.accountTypeName = "Personel";
    } else if (accountTypeName == "Diğer") {
      this.selectedAccountExtDto.accountGroupId = 0;
      this.selectedAccountExtDto.accountTypeName = "Diğer";
    }
  }
}
