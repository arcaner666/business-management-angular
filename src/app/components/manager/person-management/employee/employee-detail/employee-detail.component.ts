import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { EmployeeExtDto } from 'src/app/models/dtos/employee-ext-dto';
import { EmployeeExtDtoErrors } from 'src/app/models/validation-errors/employee-ext-dto-errors';
import { EmployeeTypeDto } from 'src/app/models/dtos/employee-type-dto';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() branchDtos!: BranchDto[];
  @Input() cardHeader!: string;
  @Input() employeeTypeDtos!: EmployeeTypeDto[];
  @Input() loading!: boolean;
  @Input() selectedEmployeeExtDto!: EmployeeExtDto;
  @Input() selectedEmployeeExtDtoErrors!: EmployeeExtDtoErrors;
  
  @Output() accountCodeGenerated = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<EmployeeExtDto>();
  
  public submitted: boolean = false;
  public genders: string[] = ["Erkek", "Kadın", "Diğer"];
  
  constructor(

  ) {
    console.log("EmployeeDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(): void {
    this.submitted = true;
    this.accountCodeGenerated.emit();
  }

  save(selectedEmployeeExtDto: EmployeeExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedEmployeeExtDto);
  }
}
