import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() accountGroupDtos!: AccountGroupDto[];
  @Input() branchDtos!: BranchDto[];
  @Input() cardHeader!: string;
  @Input() loading!: boolean;
  @Input() selectedAccountExtDto!: AccountExtDto;
  @Input() selectedAccountExtDtoErrors!: AccountExtDtoErrors;
  
  @Output() accountCodeGenerated = new EventEmitter();
  @Output() accountCodePropertiesReset = new EventEmitter();
  @Output() branchSelected = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<AccountExtDto>();
  
  public submitted: boolean = false;
  public genders: string[] = ["Erkek", "Kadın", "Diğer"];
  
  constructor() {
    console.log("AccountDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(): void {
    this.submitted = true;
    this.accountCodeGenerated.emit();
  }

  resetAccountCodeProperties() {
    this.accountCodePropertiesReset.emit();
  }

  save(selectedAccountExtDto: AccountExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedAccountExtDto);
  }
}
