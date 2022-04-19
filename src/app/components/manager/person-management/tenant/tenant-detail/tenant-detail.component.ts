import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';
import { TenantExtDtoErrors } from 'src/app/models/validation-errors/tenant-ext-dto-errors';

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.scss']
})
export class TenantDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() branchDtos!: BranchDto[];
  @Input() cardHeader!: string;
  @Input() loading!: boolean;
  @Input() selectedTenantExtDto!: TenantExtDto;
  @Input() selectedTenantExtDtoErrors!: TenantExtDtoErrors;
  
  @Output() accountCodeGenerated = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<TenantExtDto>();
  
  public submitted: boolean = false;
  public genders: string[] = ["Erkek", "Kadın", "Diğer"];
  
  constructor(

  ) {
    console.log("TenantDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateAccountCode(): void {
    this.submitted = true;
    this.accountCodeGenerated.emit();
  }

  save(selectedTenantExtDto: TenantExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedTenantExtDto);
  }
}
