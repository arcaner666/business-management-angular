import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { CashExtDto } from 'src/app/models/dtos/cash-ext-dto';
import { CashExtDtoErrors } from 'src/app/models/validation-errors/cash-ext-dto-errors';
import { CurrencyDto } from 'src/app/models/dtos/currency-dto';

@Component({
  selector: 'app-cash-detail',
  templateUrl: './cash-detail.component.html',
  styleUrls: ['./cash-detail.component.scss']
})
export class CashDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() branchDtos!: BranchDto[];
  @Input() cardHeader!: string;
  @Input() currencyDtos!: CurrencyDto[];
  @Input() loading!: boolean;
  @Input() selectedCashExtDto!: CashExtDto;
  @Input() selectedCashExtDtoErrors!: CashExtDtoErrors;
  
  @Output() accountCodeGenerated = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<CashExtDto>();
  
  public submitted: boolean = false;
  public genders: string[] = ["Erkek", "Kadın", "Diğer"];
  
  constructor(

  ) {
    console.log("CashDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(): void {
    this.submitted = true;
    this.accountCodeGenerated.emit();
  }

  save(selectedCashExtDto: CashExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedCashExtDto);
  }
}
