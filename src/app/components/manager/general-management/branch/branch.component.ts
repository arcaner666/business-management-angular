import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { BranchExtDtoErrors } from 'src/app/models/validation-errors/branch-ext-dto-errors';
import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { BranchExtService } from 'src/app/services/branch-ext.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public branchExtDtos$!: Observable<ListDataResult<BranchExtDto>>;
  public cardHeader: string = "";
  public cityDtos$!: Observable<ListDataResult<CityDto>>;
  public districtDtos$!: Observable<ListDataResult<DistrictDto>>;
  public loading: boolean = false;
  public selectedBranchExtDto: BranchExtDto;
  public selectedBranchExtDtoErrors: BranchExtDtoErrors;
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  public sub7: Subscription = new Subscription();
  
  constructor(
    private authorizationService: AuthorizationService,
    private branchExtService: BranchExtService,
    private branchService: BranchService,
    private cityService: CityService,
    private districtService: DistrictService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("BranchComponent constructor çalıştı.");

    this.selectedBranchExtDto = this.branchExtService.emptyBranchExtDto;
    this.selectedBranchExtDtoErrors = this.branchExtService.emptyBranchExtDtoErrors;

    this.getAllCities();
    this.getBranchExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedBranchExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let isModelValid = this.validateForAdd();

    if (isModelValid) {
      this.loading = true;

      this.sub1 = this.branchExtService.addExt(this.selectedBranchExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
          this.loading = false;
          return this.branchExtDtos$ = this.branchExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
      console.log(this.selectedBranchExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedBranchExtDto: BranchExtDto): void {
    this.sub2 = this.branchExtService.getExtById(selectedBranchExtDto.branchId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedBranchExtDto = response.data;
          this.districtDtos$ = this.districtService.getByCityId(response.data.cityId);

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.branchExtService.deleteExt(selectedBranchExtDto.branchId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.branchExtDtos$ = this.branchExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  generateBranchCode(): void {
    this.sub4 = this.branchService.generateBranchCode(this.authorizationService.authorizationDto.businessId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedBranchExtDto.branchOrder = response.data.branchOrder;
          this.selectedBranchExtDto.branchCode = response.data.branchCode;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }
  
  getAllCities(): void {
    this.cityDtos$ = this.cityService.getAll();
  }

  getBranchExtsByBusinessId(businessId: number): void {
    this.branchExtDtos$ = this.branchExtService.getExtsByBusinessId(businessId);
  }

  getBranchExtById(id: number): void {
    this.sub5 = this.branchExtService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedBranchExtDto = response.data;
          this.getDistrictsByCityId(response.data.cityId);
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getDistrictsByCityId(cityId: number): void {
    this.districtDtos$ = this.districtService.getByCityId(cityId);
  }

  resetErrors() {
    this.selectedBranchExtDtoErrors = this.branchExtService.emptyBranchExtDtoErrors;
  }

  resetModel() {
    this.selectedBranchExtDto.branchId = 0;
    this.selectedBranchExtDto.businessId = 0;
    this.selectedBranchExtDto.fullAddressId = 0;
    this.selectedBranchExtDto.branchOrder = 0;
    this.selectedBranchExtDto.branchName = "";
    this.selectedBranchExtDto.branchCode = "";
    this.selectedBranchExtDto.createdAt = new Date();
    this.selectedBranchExtDto.updatedAt = new Date();
  
    // Extended With FullAddress
    this.selectedBranchExtDto.cityId = 0;
    this.selectedBranchExtDto.districtId = 0;
    this.selectedBranchExtDto.addressTitle = "";
    this.selectedBranchExtDto.postalCode = 0;
    this.selectedBranchExtDto.addressText = "";
  }

  save(selectedBranchExtDto: BranchExtDto): void {
    if (selectedBranchExtDto.branchId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedBranchExtDto: BranchExtDto): void {
    this.selectedBranchExtDto = this.branchExtService.emptyBranchExtDto;

    if (!selectedBranchExtDto) {  
      selectedBranchExtDto = this.branchExtService.emptyBranchExtDto;    
    }

    this.setHeader(selectedBranchExtDto.branchId);

    if (selectedBranchExtDto.branchId != 0) {
      this.sub6 = this.branchExtService.getExtById(selectedBranchExtDto.branchId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedBranchExtDto = response.data;
            this.districtDtos$ = this.districtService.getByCityId(response.data.cityId);
            this.toastService.success(response.message);
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
    this.selectedBranchExtDto.districtId = 0;

    this.getDistrictsByCityId(cityId);
  }

  setHeader(branchId: number): void {
    branchId == 0 ? this.cardHeader = "Şube Ekle" : this.cardHeader = "Şubeyi Düzenle";
  }

  updateExt(): void {
    let isModelValid = this.validateForUpdate();

    if (isModelValid) {
      this.sub7 = this.branchExtService.updateExt(this.selectedBranchExtDto).subscribe({
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
      console.log(this.selectedBranchExtDtoErrors);
    }
  }

  validateForAdd(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedBranchExtDto.branchName)) {
      this.selectedBranchExtDtoErrors.branchName = "Lütfen şube adı giriniz.";
      isValid = false;
    } 
    if (!this.validationService.string(this.selectedBranchExtDto.branchCode)) {
      this.selectedBranchExtDtoErrors.branchCode = "Lütfen şube kodu oluşturunuz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedBranchExtDto.cityId)) {
      this.selectedBranchExtDtoErrors.cityId = "Lütfen şehir seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedBranchExtDto.districtId)) {
      this.selectedBranchExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedBranchExtDto.addressTitle)) {
      this.selectedBranchExtDtoErrors.addressTitle = "Lütfen adres başlığı giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedBranchExtDto.postalCode)) {
      this.selectedBranchExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedBranchExtDto.addressText)) {
      this.selectedBranchExtDtoErrors.addressText = "Lütfen adres giriniz.";
      isValid = false;
    }

    return isValid;
  }

  validateForUpdate(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedBranchExtDto.branchName)) {
      this.selectedBranchExtDtoErrors.branchName = "Lütfen şube adı giriniz.";
      isValid = false;
    } 
    if (!this.validationService.number(this.selectedBranchExtDto.cityId)) {
      this.selectedBranchExtDtoErrors.cityId = "Lütfen şehir seçiniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedBranchExtDto.districtId)) {
      this.selectedBranchExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedBranchExtDto.addressTitle)) {
      this.selectedBranchExtDtoErrors.addressTitle = "Lütfen adres başlığı giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedBranchExtDto.postalCode)) {
      this.selectedBranchExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedBranchExtDto.addressText)) {
      this.selectedBranchExtDtoErrors.addressText = "Lütfen adres giriniz.";
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
    if (this.sub7) {
      this.sub7.unsubscribe();
    }
  }
}
