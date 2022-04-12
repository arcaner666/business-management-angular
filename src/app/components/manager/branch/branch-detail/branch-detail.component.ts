import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm} from '@angular/forms';

import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { BranchExtDtoErrors } from 'src/app/models/validation-errors/branch-ext-dto-errors';
import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';

@Component({
  selector: 'app-branch-detail',
  templateUrl: './branch-detail.component.html',
  styleUrls: ['./branch-detail.component.scss']
})
export class BranchDetailComponent {

  @ViewChild('form') form!: NgForm;

  @Input() cardHeader: string = "";
  @Input() cityDtos!: CityDto[];
  @Input() districtDtos!: DistrictDto[];
  @Input() selectedBranchExtDto!: BranchExtDto;
  @Input() selectedBranchExtDtoErrors!: BranchExtDtoErrors;
  @Input() loading: boolean = false;

  @Output() saved = new EventEmitter<BranchExtDto>();
  @Output() branchCodeGenerated = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() citySelected = new EventEmitter<number>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("BranchDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  generateBranchCode(): void {
    this.branchCodeGenerated.emit();
  }

  save(selectedBranchExtDto: BranchExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedBranchExtDto);
  }

  selectCity(cityId: number): void {
    this.citySelected.emit(cityId);
  }
}
