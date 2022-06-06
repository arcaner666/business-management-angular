import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY, from, take } from 'rxjs';
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
import { SectionExtService } from 'src/app/services/section.service';
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

    this.cityDtos$ = this.getAllCities();
    this.managerDtos$ = this.getManagersByBusinessId();
    this.sectionExtDtos$ = this.getSectionExtsByBusinessId();
    this.sectionGroupDtos$ = this.getSectionGroupsByBusinessId();
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

          return this.getSectionExtsByBusinessId();
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
    this.selectedSectionExtDto = selectedSectionExtDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
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
        return this.getSectionExtsByBusinessId();
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

  getAllCities(): Observable<ListDataResult<CityDto>> {
    this.cityDtos$ = this.cityService.getAll();
    return this.cityDtos$;
  }

  getDistrictsByCityId(cityId: number): Observable<ListDataResult<DistrictDto>> {
    this.districtDtos$ = this.districtService.getByCityId(cityId);
    return this.districtDtos$;
  }

  getManagersByBusinessId(): Observable<ListDataResult<ManagerDto>> {
    this.managerDtos$ = this.managerService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.managerDtos$;
  }

  getSectionExtsByBusinessId(): Observable<ListDataResult<SectionExtDto>> {
    this.sectionExtDtos$ = this.sectionExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.sectionExtDtos$;
  }

  getSectionGroupsByBusinessId(): Observable<ListDataResult<SectionGroupDto>> {
    this.sectionGroupDtos$ = this.sectionGroupService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.sectionGroupDtos$;
  }

  save(selectedSectionExtDto: SectionExtDto): void {
    if (selectedSectionExtDto.sectionId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedSectionExtDto: SectionExtDto): void {
    if (selectedSectionExtDto) {
      this.selectedSectionExtDto = selectedSectionExtDto;
      this.districtDtos$ = this.getDistrictsByCityId(selectedSectionExtDto.cityId);
    } else {
      this.selectedSectionExtDto = this.sectionExtService.emptySectionExtDto;  
    }
    this.setHeader(this.selectedSectionExtDto.sectionId);
    this.activePage = "detail";
  }

  selectCity(cityId: number): void {
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedSectionExtDto.districtId = 0;

    this.districtDtos$ = this.getDistrictsByCityId(cityId);
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
