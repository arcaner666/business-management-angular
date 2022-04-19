import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
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
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  
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

    let isModelValid = this.validateForAdd();

    if (isModelValid) {
      this.loading = true;

      this.sub1 = this.sectionExtService.addExt(this.selectedSectionExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
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
    this.sub2 = this.sectionExtService.getExtById(selectedSectionExtDto.sectionId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedSectionExtDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.sectionExtService.deleteExt(selectedSectionExtDto.sectionId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.sectionExtDtos$ = this.sectionExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
                })
              ).subscribe({
                error: (error) => {
                  console.log(error);
                  this.toastService.danger(error.message);
                }
              });
            }
          }).catch(() => {});
        }
        this.loading = false;
      }, error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
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

  getSectionExtById(id: number): void {
    this.sub4 = this.sectionExtService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedSectionExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  resetErrors() {
    this.selectedSectionExtDtoErrors = this.sectionExtService.emptySectionExtDtoErrors;
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
      this.sub5 = this.sectionExtService.getExtById(selectedSectionExtDto.sectionId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedSectionExtDto = response.data;
            this.districtDtos$ = this.districtService.getByCityId(response.data.cityId);
          }
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
    let isModelValid = this.validateForUpdate();

    if (isModelValid) {
      this.sub6 = this.sectionExtService.updateExt(this.selectedSectionExtDto).subscribe({
        next: (response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
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

  validateForAdd(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedSectionExtDto.sectionName)) {
      this.selectedSectionExtDtoErrors.sectionName = "Lütfen site adı giriniz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedSectionExtDto.sectionGroupId)) {
      this.selectedSectionExtDtoErrors.sectionGroupId = "Lütfen site grubu seçiniz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedSectionExtDto.managerId)) {
      this.selectedSectionExtDtoErrors.managerId = "Lütfen yönetici seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedSectionExtDto.cityId)) {
      this.selectedSectionExtDtoErrors.cityId = "Lütfen şehir seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedSectionExtDto.districtId)) {
      this.selectedSectionExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedSectionExtDto.postalCode)) {
      this.selectedSectionExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedSectionExtDto.addressText)) {
      this.selectedSectionExtDtoErrors.addressText = "Lütfen adres giriniz.";
      isValid = false;
    }

    return isValid;
  }

  validateForUpdate(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedSectionExtDto.sectionName)) {
      this.selectedSectionExtDtoErrors.sectionName = "Lütfen site adı giriniz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedSectionExtDto.sectionGroupId)) {
      this.selectedSectionExtDtoErrors.sectionGroupId = "Lütfen site grubu seçiniz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedSectionExtDto.managerId)) {
      this.selectedSectionExtDtoErrors.managerId = "Lütfen yönetici seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedSectionExtDto.cityId)) {
      this.selectedSectionExtDtoErrors.cityId = "Lütfen şehir seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedSectionExtDto.districtId)) {
      this.selectedSectionExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedSectionExtDto.postalCode)) {
      this.selectedSectionExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedSectionExtDto.addressText)) {
      this.selectedSectionExtDtoErrors.addressText = "Lütfen adres giriniz.";
      isValid = false;
    }

    return isValid;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
    if (this.sub4) {
      this.sub4.unsubscribe();
    }
    if (this.sub5) {
      this.sub5.unsubscribe();
    }
    if (this.sub6) {
      this.sub6.unsubscribe();
    }
  }
}
