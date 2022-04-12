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
import { SectionGroupService } from 'src/app/services/section-group.service';
import { SectionService } from 'src/app/services/section.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

const EMPTY_SECTION_EXT_DTO: SectionExtDto = {
  sectionId: 0,
  sectionGroupId: 0,
  businessId: 0,
  branchId: 0,
  managerId: 0,
  fullAddressId: 0,
  sectionName: "",
  sectionCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With SectionGroup
  sectionGroupName: "",

  // Extended With Manager
  managerNameSurname: "",

  // Extended With FullAddress
  cityId: 0,
  districtId: 0,
  addressTitle: "",
  postalCode: 0,
  addressText: "",

  // Extended With FullAddress + City
  cityName: "",

  // Extended With FullAddress + District
  districtName: "",
};

const EMPTY_SECTION_EXT_DTO_ERRORS: SectionExtDtoErrors = {
  sectionId: "",
  sectionGroupId: "",
  businessId: "",
  branchId: "",
  managerId: "",
  fullAddressId: "",
  sectionName: "",
  sectionCode: "",
  createdAt: "",
  updatedAt: "",

  // Extended With SectionGroup
  sectionGroupName: "",

  // Extended With Manager
  managerNameSurname: "",

  // Extended With FullAddress
  cityId: "",
  districtId: "",
  addressTitle: "",
  postalCode: "",
  addressText: "",

  // Extended With FullAddress + City
  cityName: "",

  // Extended With FullAddress + District
  districtName: "",
};

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
  public selectedSectionExtDto: SectionExtDto = cloneDeep(EMPTY_SECTION_EXT_DTO);
  public selectedSectionExtDtoErrors: SectionExtDtoErrors = cloneDeep(EMPTY_SECTION_EXT_DTO_ERRORS);
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
    private sectionService: SectionService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("SectionComponent constructor çalıştı.");

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

      this.sub1 = this.sectionService.addExt(this.selectedSectionExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
          this.loading = false;
          return this.sectionExtDtos$ = this.sectionService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
    this.selectedSectionExtDto = cloneDeep(EMPTY_SECTION_EXT_DTO);

    this.sub2 = this.sectionService.getExtById(selectedSectionExtDto.sectionId).subscribe({
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
              this.sub3 = this.sectionService.deleteExt(selectedSectionExtDto.sectionId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.sectionExtDtos$ = this.sectionService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
    this.sectionExtDtos$ = this.sectionService.getExtsByBusinessId(businessId);
  }

  getSectionGroupsByBusinessId(businessId: number): void {
    this.sectionGroupDtos$ = this.sectionGroupService.getByBusinessId(businessId);
  }

  getSectionExtById(id: number): void {
    this.sub4 = this.sectionService.getExtById(id).subscribe({
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
    this.selectedSectionExtDtoErrors = cloneDeep(EMPTY_SECTION_EXT_DTO_ERRORS);
  }

  resetModel() {
    this.selectedSectionExtDto.sectionId = 0;
    this.selectedSectionExtDto.sectionGroupId = 0;
    this.selectedSectionExtDto.businessId = 0;
    this.selectedSectionExtDto.branchId = 0;
    this.selectedSectionExtDto.managerId = 0;
    this.selectedSectionExtDto.fullAddressId = 0;
    this.selectedSectionExtDto.sectionName = "";
    this.selectedSectionExtDto.sectionCode = "";
    this.selectedSectionExtDto.createdAt = new Date();
    this.selectedSectionExtDto.updatedAt = new Date();
  
    // Extended With SectionGroup
    this.selectedSectionExtDto.sectionGroupName = "";
  
    // Extended With Manager
    this.selectedSectionExtDto.managerNameSurname = "";
  
    // Extended With FullAddress
    this.selectedSectionExtDto.cityId = 0;
    this.selectedSectionExtDto.districtId = 0;
    this.selectedSectionExtDto.addressTitle = "";
    this.selectedSectionExtDto.postalCode = 0;
    this.selectedSectionExtDto.addressText = "";
  
    // Extended With FullAddress + City
    this.selectedSectionExtDto.cityName = "";
  
    // Extended With FullAddress + District
    this.selectedSectionExtDto.districtName = "";
  }

  save(selectedSectionExtDto: SectionExtDto): void {
    if (selectedSectionExtDto.sectionId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedSectionExtDto: SectionExtDto): void {
    this.setHeader(selectedSectionExtDto.sectionId);

    this.selectedSectionExtDto = cloneDeep(EMPTY_SECTION_EXT_DTO);

    if (selectedSectionExtDto.sectionId != 0) {
      this.sub5 = this.sectionService.getExtById(selectedSectionExtDto.sectionId).subscribe({
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
      this.sub6 = this.sectionService.updateExt(this.selectedSectionExtDto).subscribe({
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
