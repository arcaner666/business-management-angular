import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SectionExtDtoErrors } from 'src/app/models/validation-errors/section-ext-dto-errors';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SectionExtService } from 'src/app/services/section-ext.service';
import { SectionGroupService } from 'src/app/services/section-group.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public cardHeader: string = "";
  public cityDtos$!: Observable<ListDataResult<CityDto>>;
  public districtDtos$!: Observable<ListDataResult<DistrictDto>>;
  public loading: boolean = false;
  public managerDtos$!: Observable<ListDataResult<ManagerDto>>;
  public sectionExtDtos$!: Observable<ListDataResult<SectionExtDto>>;
  public sectionGroupDtos$!: Observable<ListDataResult<SectionGroupDto>>;
  public selectedSectionExtDto: SectionExtDto;
  public selectedSectionExtDtoErrors: SectionExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private authorizationService: AuthorizationService,
    private cityService: CityService,
    private districtService: DistrictService,
    private managerService: ManagerService,
    private modalService: NgbModal,
    private sectionGroupService: SectionGroupService,
    private sectionExtService: SectionExtService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("SectionComponent constructor çalıştı.");

    this.selectedSectionExtDto = this.sectionExtService.emptySectionExtDto;
    this.selectedSectionExtDtoErrors = this.sectionExtService.emptySectionExtDtoErrors;

    this.getAllCities();
    this.getManagersByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getSectionExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getSectionGroupsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    this.selectedSectionExtDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.selectedSectionExtDto.branchId = this.authorizationService.authorizationDto.branchId;

    let [isModelValid, errors] = this.validationService.validateSectionExtDto(this.selectedSectionExtDto, "add");
    this.selectedSectionExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.sectionExtService.addExt(this.selectedSectionExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;

          return this.sectionExtDtos$ = this.sectionExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
        }
      )).subscribe({
        error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedSectionExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedSectionExtDto: SectionExtDto): void {
    this.sectionExtService.getExtById(selectedSectionExtDto.sectionId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedSectionExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.sectionExtService.deleteExt(selectedSectionExtDto.sectionId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.sectionExtDtos$ = this.sectionExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
      })
    ).subscribe({
      next: (response) => {
        console.log(response);
        this.toastService.success(response.message);
        this.loading = false;
      }, error: (error) => {
        console.log(error);
        if (error != "cancel") {
          this.toastService.danger(error.message);
        }
        this.loading = false;
      }
    });
  }

  getAllCities(): void {
    this.cityDtos$ = this.cityService.getAll();
  }

  getDistrictsByCityId(cityId: number): void {
    this.districtDtos$ = this.districtService.getByCityId(cityId);
  }

  getManagersByBusinessId(businessId: number): void {
    this.managerDtos$ = this.managerService.getByBusinessId(businessId);
  }

  getSectionExtsByBusinessId(businessId: number): void {
    this.sectionExtDtos$ = this.sectionExtService.getExtsByBusinessId(businessId);
  }

  getSectionGroupsByBusinessId(businessId: number): void {
    this.sectionGroupDtos$ = this.sectionGroupService.getByBusinessId(businessId);
  }

  save(selectedSectionExtDto: SectionExtDto): void {
    if (selectedSectionExtDto.sectionId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedSectionExtDto: SectionExtDto): void {
    this.selectedSectionExtDto = this.sectionExtService.emptySectionExtDto;
    
    if (!selectedSectionExtDto) {  
      selectedSectionExtDto = this.sectionExtService.emptySectionExtDto;    
    } 

    this.setHeader(selectedSectionExtDto.sectionId);

    if (selectedSectionExtDto.sectionId != 0) {
      this.sectionExtService.getExtById(selectedSectionExtDto.sectionId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedSectionExtDto = response.data;
          this.districtDtos$ = this.districtService.getByCityId(response.data.cityId);
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  selectCity(cityId: number): void {
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedSectionExtDto.districtId = 0;

    this.getDistrictsByCityId(cityId);
  }

  setHeader(sectionId: number): void {
    sectionId == 0 ? this.cardHeader = "Site Ekle" : this.cardHeader = "Siteyi Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateSectionExtDto(this.selectedSectionExtDto, "update");
    this.selectedSectionExtDtoErrors = errors;
    if (isModelValid) {
      this.sectionExtService.updateExt(this.selectedSectionExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
          this.loading = false;
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedSectionExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
