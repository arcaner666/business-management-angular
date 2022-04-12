import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { FlatExtDtoErrors } from 'src/app/models/validation-errors/flat-ext-dto-errors';
import { HouseOwnerDto } from 'src/app/models/dtos/house-owner-dto';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { TenantDto } from 'src/app/models/dtos/tenant-dto';

@Component({
  selector: 'app-flat-detail',
  templateUrl: './flat-detail.component.html',
  styleUrls: ['./flat-detail.component.scss']
})
export class FlatDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() apartmentDtos!: ApartmentDto[];
  @Input() cardHeader: string = "";
  @Input() houseOwnerDtos!: HouseOwnerDto[];
  @Input() loading: boolean = false;
  @Input() sectionDtos!: SectionDto[];
  @Input() selectedFlatExtDto!: FlatExtDto;
  @Input() selectedFlatExtDtoErrors!: FlatExtDtoErrors;
  @Input() tenantDtos!: TenantDto[];

  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter<FlatExtDto>();
  @Output() sectionSelected = new EventEmitter<number>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("FlatDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  save(selectedFlatExtDto: FlatExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedFlatExtDto);
  }

  selectSection(sectionId: number): void {
    this.sectionSelected.emit(sectionId);
  }
}
