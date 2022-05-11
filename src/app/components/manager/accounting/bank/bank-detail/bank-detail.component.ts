import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BankExtDto } from 'src/app/models/dtos/bank-ext-dto';
import { BankExtDtoErrors } from 'src/app/models/validation-errors/bank-ext-dto-errors';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { CityDto } from 'src/app/models/dtos/city-dto';
import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() branchDtos!: BranchDto[];
  @Input() cardHeader!: string;
  @Input() cityDtos!: CityDto[];
  @Input() currencyDtos!: CurrencyDto[];
  @Input() districtDtos!: DistrictDto[];
  @Input() loading!: boolean;
  @Input() selectedBankExtDto!: BankExtDto;
  @Input() selectedBankExtDtoErrors!: BankExtDtoErrors;
  
  @Output() accountCodeGenerated = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() citySelected = new EventEmitter<number>();
  @Output() saved = new EventEmitter<BankExtDto>();
  
  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("BankDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(): void {
    this.submitted = true;
    this.accountCodeGenerated.emit();
  }

  save(selectedBankExtDto: BankExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedBankExtDto);
  }

  selectCity(cityId: number): void {
    this.citySelected.emit(cityId);
  }
}
