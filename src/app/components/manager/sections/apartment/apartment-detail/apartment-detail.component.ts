import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { ApartmentExtDtoErrors } from 'src/app/models/validation-errors/apartment-ext-dto-errors';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionDto } from 'src/app/models/dtos/section-dto';

@Component({
  selector: 'app-apartment-detail',
  templateUrl: './apartment-detail.component.html',
  styleUrls: ['./apartment-detail.component.scss']
})
export class ApartmentDetailComponent {

  @ViewChild('form') form!: NgForm;
  
  @Input() cardHeader: string = "";
  @Input() loading: boolean = false;
  @Input() managerDtos!: ManagerDto[];
  @Input() sectionDtos!: SectionDto[];
  @Input() selectedApartmentExtDto!: ApartmentExtDto;
  @Input() selectedApartmentExtDtoErrors!: ApartmentExtDtoErrors;

  @Output() cancelled = new EventEmitter();
  @Output() modelReset = new EventEmitter();
  @Output() saved = new EventEmitter<ApartmentExtDto>();

  public submitted: boolean = false;
  
  constructor(

  ) {
    console.log("ApartmentDetailComponent constructor çalıştı.");
  }

  cancel(): void {
    this.cancelled.emit();
  }

  resetModel() {
    this.submitted = false;
    this.modelReset.emit();
  }

  save(selectedApartmentExtDto: ApartmentExtDto): void {
    this.submitted = true;
    this.saved.emit(selectedApartmentExtDto);
  }
}
