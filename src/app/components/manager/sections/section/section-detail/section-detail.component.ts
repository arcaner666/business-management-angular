import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';
import { SectionExtDtoErrors } from 'src/app/models/validation-errors/section-ext-dto-errors';

@Component({
  selector: 'app-section-detail',
  templateUrl: './section-detail.component.html',
  styleUrls: ['./section-detail.component.scss']
})
export class SectionDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader: string = "";
  @Input() cityDtos!: CityDto[];
  @Input() districtDtos!: DistrictDto[];
  @Input() loading: boolean = false;
  @Input() managerDtos!: ManagerDto[];
  @Input() sectionGroupDtos!: SectionGroupDto[];
  @Input() selectedSectionExtDto!: SectionExtDto;
  @Input() selectedSectionExtDtoErrors!: SectionExtDtoErrors;

  @Output() cancelled = new EventEmitter();
  @Output() citySelected = new EventEmitter<number>();
  @Output() saved = new EventEmitter<SectionExtDto>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("SectionDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedSectionExtDto: SectionExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedSectionExtDto);
  }

  selectCity(cityId: number): void {
    this.citySelected.emit(cityId);
  }
}
