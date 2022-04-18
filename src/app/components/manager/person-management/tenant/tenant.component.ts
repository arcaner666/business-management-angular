import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';
import { TenantExtDtoErrors } from 'src/app/models/validation-errors/tenant-ext-dto-errors';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { TenantExtService } from 'src/app/services/tenant-ext.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

const EMPTY_TENANT_EXT_DTO: TenantExtDto = {
  tenantId: 0,
  businessId: 0,
  branchId: 0,
  accountId: 0,
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: undefined,
  gender: "",
  notes: "",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Account
  accountGroupId: 0,
  accountOrder: 0,
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: 0,
  identityNumber: 0,
  limit: 0,
  standartMaturity: 0,
};

const EMPTY_TENANT_EXT_DTO_ERRORS: TenantExtDtoErrors = {
  tenantId: "",
  businessId: "",
  branchId: "",
  accountId: "",
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  notes: "",
  avatarUrl: "",
  createdAt: "",
  updatedAt: "",

  // Extended With Account
  accountGroupId: "",
  accountOrder: "",
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: "",
  identityNumber: "",
  limit: "",
  standartMaturity: "",
};

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss']
})
export class TenantComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public accountGroupDtos: AccountGroupDto[] = [];
  public activePage: string = "list";
  public cardHeader: string = "";
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public loading: boolean = false;
  public selectedTenantExtDto: TenantExtDto = cloneDeep(EMPTY_TENANT_EXT_DTO);
  public selectedTenantExtDtoErrors: TenantExtDtoErrors = cloneDeep(EMPTY_TENANT_EXT_DTO_ERRORS);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  public sub7: Subscription = new Subscription();
  public sub8: Subscription = new Subscription();
  public tenantExtDtos$!: Observable<ListDataResult<TenantExtDto>>;
  
  constructor(
    private accountExtService: AccountExtService,
    private accountGroupService: AccountGroupService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private modalService: NgbModal,
    private tenantExtService: TenantExtService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("TenantComponent constructor çalıştı.");

    this.getAllAccountGroups();

    this.getBranchsByBusinessId(this.authorizationService.authorizationDto.businessId);

    this.getTenantExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedTenantExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let isModelValid = this.validateForAdd();

    if (isModelValid) {
      this.loading = true;

      this.sub1 = this.tenantExtService.addExt(this.selectedTenantExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
          this.loading = false;
  
          return this.tenantExtDtos$ = this.tenantExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
      console.log(this.selectedTenantExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedTenantExtDto: TenantExtDto): void {
    this.selectedTenantExtDto = cloneDeep(EMPTY_TENANT_EXT_DTO);

    this.sub2 = this.tenantExtService.getExtById(selectedTenantExtDto.tenantId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedTenantExtDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.tenantExtService.deleteExt(selectedTenantExtDto.tenantId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);

                  return this.tenantExtDtos$ = this.tenantExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  generateAccountCode() {
    let isModelValid = this.validateForGeneratingAccountCode();

    if (isModelValid) {      
      this.sub4 = this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.selectedTenantExtDto.branchId, 
        "120").subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedTenantExtDto.accountOrder = response.data.accountOrder;
            this.selectedTenantExtDto.accountCode = response.data.accountCode;
          }
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedTenantExtDtoErrors);
    }
  }

  getAllAccountGroups(): void {
    this.sub5 = this.accountGroupService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.accountGroupDtos = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getBranchsByBusinessId(businessId: number): void {
    this.branchDtos$ = this.branchService.getByBusinessId(businessId);
  }

  getTenantExtById(id: number): void {
    this.sub5 = this.tenantExtService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedTenantExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getTenantExtsByBusinessId(id: number): void {
    this.tenantExtDtos$ = this.tenantExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  resetErrors() {
    this.selectedTenantExtDtoErrors = cloneDeep(EMPTY_TENANT_EXT_DTO_ERRORS);
  }

  resetModel() {
    this.selectedTenantExtDto.tenantId = 0;
    this.selectedTenantExtDto.businessId = 0;
    this.selectedTenantExtDto.branchId = 0;
    this.selectedTenantExtDto.accountId = 0;
    this.selectedTenantExtDto.nameSurname = "";
    this.selectedTenantExtDto.email = "";
    this.selectedTenantExtDto.phone = "";
    this.selectedTenantExtDto.dateOfBirth = undefined;
    this.selectedTenantExtDto.gender = "";
    this.selectedTenantExtDto.notes = "";
    this.selectedTenantExtDto.avatarUrl = "";
    this.selectedTenantExtDto.createdAt = new Date();
    this.selectedTenantExtDto.updatedAt = new Date();

    // Extended With Account
    this.selectedTenantExtDto.accountGroupId = 0;
    this.selectedTenantExtDto.accountOrder = 0;
    this.selectedTenantExtDto.accountName = "";
    this.selectedTenantExtDto.accountCode = "";
    this.selectedTenantExtDto.taxOffice = "";
    this.selectedTenantExtDto.taxNumber = 0;
    this.selectedTenantExtDto.identityNumber = 0;
    this.selectedTenantExtDto.limit = 0;
    this.selectedTenantExtDto.standartMaturity = 0;
  }

  save(selectedTenantExtDto: TenantExtDto): void {
    if (selectedTenantExtDto.tenantId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }


  select(selectedTenantExtDto: TenantExtDto): void {
    this.setHeader(selectedTenantExtDto.tenantId);

    this.selectedTenantExtDto = cloneDeep(EMPTY_TENANT_EXT_DTO);

    if (selectedTenantExtDto.tenantId != 0) {
      this.sub7 = this.tenantExtService.getExtById(selectedTenantExtDto.tenantId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedTenantExtDto = response.data;
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(tenantId: number): void {
    tenantId == 0 ? this.cardHeader = "Kiracı Ekle" : this.cardHeader = "Kiracıyı Düzenle";
  }

  updateExt(): void {
    let isModelValid = this.validateForUpdate();

    if (isModelValid) {
      this.sub8 = this.tenantExtService.updateExt(this.selectedTenantExtDto).subscribe({
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
      console.log(this.selectedTenantExtDtoErrors);
    }
  }

  validateForAdd(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedTenantExtDto.nameSurname)) {
      this.selectedTenantExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedTenantExtDto.phone)) {
      this.selectedTenantExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.stringPreciseLength(this.selectedTenantExtDto.phone, 10)) {
      this.selectedTenantExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.branchId)) {
      this.selectedTenantExtDtoErrors.branchId = "Lütfen şube seçiniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedTenantExtDto.accountName)) {
      this.selectedTenantExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedTenantExtDto.accountCode)) {
      this.selectedTenantExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedTenantExtDto.taxOffice)) {
      this.selectedTenantExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.taxNumber)) {
      this.selectedTenantExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.identityNumber)) {
      this.selectedTenantExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.numberPreciseLength(this.selectedTenantExtDto.identityNumber, 11)) {
      this.selectedTenantExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.limit)) {
      this.selectedTenantExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.standartMaturity)) {
      this.selectedTenantExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";
      isValid = false;
    }

    return isValid;
  }

  validateForGeneratingAccountCode(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.number(this.selectedTenantExtDto.branchId)) {
      this.selectedTenantExtDtoErrors.branchId = "Lütfen şube seçiniz.";
      isValid = false;
    }

    return isValid;
  }

  validateForUpdate(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedTenantExtDto.nameSurname)) {
      this.selectedTenantExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedTenantExtDto.accountName)) {
      this.selectedTenantExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedTenantExtDto.taxOffice)) {
      this.selectedTenantExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.taxNumber)) {
      this.selectedTenantExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.identityNumber)) {
      this.selectedTenantExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.numberPreciseLength(this.selectedTenantExtDto.identityNumber, 11)) {
      this.selectedTenantExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.limit)) {
      this.selectedTenantExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedTenantExtDto.standartMaturity)) {
      this.selectedTenantExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";
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
    if (this.sub8) {
      this.sub8.unsubscribe();
    }
  }
}
