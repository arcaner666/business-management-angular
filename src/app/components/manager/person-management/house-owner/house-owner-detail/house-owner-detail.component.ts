import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { HouseOwnerExtDtoErrors } from 'src/app/models/validation-errors/house-owner-ext-dto-errors';

@Component({
  selector: 'app-house-owner-detail',
  templateUrl: './house-owner-detail.component.html',
  styleUrls: ['./house-owner-detail.component.scss']
})
export class HouseOwnerDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() branchDtos!: BranchDto[];
  @Input() cardHeader!: string;
  @Input() loading!: boolean;
  @Input() selectedHouseOwnerExtDto!: HouseOwnerExtDto;
  @Input() selectedHouseOwnerExtDtoErrors!: HouseOwnerExtDtoErrors;
  
  @Output() accountCodeGenerated = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() modelReset = new EventEmitter();
  @Output() saved = new EventEmitter<HouseOwnerExtDto>();
  
  public submitted: boolean = false;
  public genders: string[] = ["Erkek", "Kadın", "Diğer"];
  
  constructor(

  ) {
    console.log("HouseOwnerDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(): void {
    this.submitted = true;
    this.accountCodeGenerated.emit();
  }

  resetModel() {
    this.submitted = false;
    this.modelReset.emit();
  }

  save(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    console.log(this.selectedHouseOwnerExtDto.dateOfBirth);
    console.log(typeof this.selectedHouseOwnerExtDto.dateOfBirth);
    this.submitted = true;
    this.saved.emit(selectedHouseOwnerExtDto);
  }
}
