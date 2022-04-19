import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { FlatExtDtoErrors } from 'src/app/models/validation-errors/flat-ext-dto-errors';
import { HouseOwnerDto } from 'src/app/models/dtos/house-owner-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { TenantDto } from 'src/app/models/dtos/tenant-dto';

import { ApartmentService } from 'src/app/services/apartment.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { FlatExtService } from 'src/app/services/flat-ext.service';
import { HouseOwnerService } from 'src/app/services/house-owner.service';
import { SectionService } from 'src/app/services/section.service';
import { TenantService } from 'src/app/services/tenant.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-flat',
  templateUrl: './flat.component.html',
  styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public apartmentDtos$!: Observable<ListDataResult<ApartmentDto>>;
  public cardHeader: string = "";
  public houseOwnerDtos$!: Observable<ListDataResult<HouseOwnerDto>>;
  public flatExtDtos$!: Observable<ListDataResult<FlatExtDto>>;
  public loading: boolean = false;
  public sectionDtos$!: Observable<ListDataResult<SectionDto>>;
  public selectedFlatExtDto: FlatExtDto;
  public selectedFlatExtDtoErrors: FlatExtDtoErrors;
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  public tenantDtos$!: Observable<ListDataResult<TenantDto>>;
  
  constructor(
    private apartmentService: ApartmentService,
    private authorizationService: AuthorizationService,
    private houseOwnerService: HouseOwnerService,
    private flatExtService: FlatExtService,
    private modalService: NgbModal,
    private sectionService: SectionService,
    private tenantService: TenantService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("FlatComponent constructor çalıştı.");

    this.selectedFlatExtDto = this.flatExtService.emptyFlatExtDto;
    this.selectedFlatExtDtoErrors = this.flatExtService.emptyFlatExtDtoErrors;

    this.getFlatExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getHouseOwnersByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getSectionsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getTenantsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    this.selectedFlatExtDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.selectedFlatExtDto.branchId = this.authorizationService.authorizationDto.branchId;

    let isModelValid = this.validateForAdd();

    if (isModelValid) {
      this.loading = true;

      this.sub1 = this.flatExtService.addExt(this.selectedFlatExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
          this.loading = false;
          return this.flatExtDtos$ = this.flatExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
      console.log(this.selectedFlatExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedFlatExtDto: FlatExtDto): void {
    this.sub2 = this.flatExtService.getExtById(selectedFlatExtDto.flatId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedFlatExtDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.flatExtService.deleteExt(selectedFlatExtDto.flatId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.flatExtDtos$ = this.flatExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getApartmentsBySectionId(sectionId: number): void {
    this.apartmentDtos$ = this.apartmentService.getBySectionId(sectionId);
  }

  getHouseOwnersByBusinessId(businessId: number): void {
    this.houseOwnerDtos$ = this.houseOwnerService.getByBusinessId(businessId);
  }

  getSectionsByBusinessId(businessId: number): void {
    this.sectionDtos$ = this.sectionService.getByBusinessId(businessId);
  }

  getFlatExtById(id: number): void {
    this.sub4 = this.flatExtService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedFlatExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getFlatExtsByBusinessId(businessId: number): void {
    this.flatExtDtos$ = this.flatExtService.getExtsByBusinessId(businessId);
  }

  getTenantsByBusinessId(businessId: number): void {
    this.tenantDtos$ = this.tenantService.getByBusinessId(businessId);
  }

  resetErrors() {
    this.selectedFlatExtDtoErrors = this.flatExtService.emptyFlatExtDtoErrors;
  }

  save(selectedFlatExtDto: FlatExtDto): void {
    if (selectedFlatExtDto.flatId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedFlatExtDto: FlatExtDto): void {
    this.selectedFlatExtDto = this.flatExtService.emptyFlatExtDto;
    
    if (!selectedFlatExtDto) {  
      selectedFlatExtDto = this.flatExtService.emptyFlatExtDto;    
    } 

    this.setHeader(selectedFlatExtDto.flatId);

    if (selectedFlatExtDto.flatId != 0) {
      this.sub5 = this.flatExtService.getExtById(selectedFlatExtDto.flatId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedFlatExtDto = response.data;
            this.apartmentDtos$ = this.apartmentService.getBySectionId(response.data.sectionId);
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  selectSection(sectionId: number): void {
    // Site listesi her yenilendiğinde apartman listesi de yenilenmeli.
    this.selectedFlatExtDto.apartmentId = 0;

    this.getApartmentsBySectionId(sectionId);
  }

  setHeader(flatId: number): void {
    flatId == 0 ? this.cardHeader = "Daire Ekle" : this.cardHeader = "Daireyi Düzenle";
  }

  updateExt(): void {
    let isModelValid = this.validateForUpdate();

    if (isModelValid) {
      this.sub6 = this.flatExtService.updateExt(this.selectedFlatExtDto).subscribe({
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
      console.log(this.selectedFlatExtDtoErrors);
    }
  }

  validateForAdd(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.number(this.selectedFlatExtDto.sectionId)) {
      this.selectedFlatExtDtoErrors.sectionId = "Lütfen site seçiniz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedFlatExtDto.apartmentId)) {
      this.selectedFlatExtDtoErrors.apartmentId = "Lütfen apartman seçiniz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedFlatExtDto.doorNumber)) {
      this.selectedFlatExtDtoErrors.doorNumber = "Lütfen kapı numarası giriniz.";
      isValid = false;
    }

    return isValid;
  }

  validateForUpdate(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.number(this.selectedFlatExtDto.doorNumber)) {
      this.selectedFlatExtDtoErrors.doorNumber = "Lütfen kapı numarası giriniz.";
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
