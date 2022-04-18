import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { HouseOwnerExtDtoErrors } from 'src/app/models/validation-errors/house-owner-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { HouseOwnerExtService } from 'src/app/services/house-owner-ext.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

const EMPTY_HOUSE_OWNER_EXT_DTO: HouseOwnerExtDto = {
  houseOwnerId: 0,
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

const EMPTY_HOUSE_OWNER_EXT_DTO_ERRORS: HouseOwnerExtDtoErrors = {
  houseOwnerId: "",
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
  selector: 'app-house-owner',
  templateUrl: './house-owner.component.html',
  styleUrls: ['./house-owner.component.scss']
})
export class HouseOwnerComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public accountGroupDtos: AccountGroupDto[] = [];
  public activePage: string = "list";
  public cardHeader: string = "";
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public houseOwnerExtDtos$!: Observable<ListDataResult<HouseOwnerExtDto>>;
  public loading: boolean = false;
  public selectedHouseOwnerExtDto: HouseOwnerExtDto = cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO);
  public selectedHouseOwnerExtDtoErrors: HouseOwnerExtDtoErrors = cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO_ERRORS);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  public sub7: Subscription = new Subscription();
  public sub8: Subscription = new Subscription();
  
  constructor(
    private accountExtService: AccountExtService,
    private accountGroupService: AccountGroupService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private houseOwnerExtService: HouseOwnerExtService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("HouseOwnerComponent constructor çalıştı.");

    this.getAllAccountGroups();

    this.getBranchsByBusinessId(this.authorizationService.authorizationDto.businessId);

    this.getHouseOwnerExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedHouseOwnerExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let isModelValid = this.validateForAdd();

    if (isModelValid) {
      this.loading = true;

      this.sub1 = this.houseOwnerExtService.addExt(this.selectedHouseOwnerExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
          this.loading = false;
  
          return this.houseOwnerExtDtos$ = this.houseOwnerExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
      console.log(this.selectedHouseOwnerExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.selectedHouseOwnerExtDto = cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO);

    this.sub2 = this.houseOwnerExtService.getExtById(selectedHouseOwnerExtDto.houseOwnerId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedHouseOwnerExtDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.houseOwnerExtService.deleteExt(selectedHouseOwnerExtDto.houseOwnerId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);

                  return this.houseOwnerExtDtos$ = this.houseOwnerExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
        this.selectedHouseOwnerExtDto.branchId, 
        "120").subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedHouseOwnerExtDto.accountOrder = response.data.accountOrder;
            this.selectedHouseOwnerExtDto.accountCode = response.data.accountCode;
          }
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedHouseOwnerExtDtoErrors);
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

  getHouseOwnerExtById(id: number): void {
    this.sub5 = this.houseOwnerExtService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedHouseOwnerExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getHouseOwnerExtsByBusinessId(id: number): void {
    this.houseOwnerExtDtos$ = this.houseOwnerExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  resetErrors() {
    this.selectedHouseOwnerExtDtoErrors = cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO_ERRORS);
  }

  resetModel() {
    this.selectedHouseOwnerExtDto.houseOwnerId = 0;
    this.selectedHouseOwnerExtDto.businessId = 0;
    this.selectedHouseOwnerExtDto.branchId = 0;
    this.selectedHouseOwnerExtDto.accountId = 0;
    this.selectedHouseOwnerExtDto.nameSurname = "";
    this.selectedHouseOwnerExtDto.email = "";
    this.selectedHouseOwnerExtDto.phone = "";
    this.selectedHouseOwnerExtDto.dateOfBirth = undefined;
    this.selectedHouseOwnerExtDto.gender = "";
    this.selectedHouseOwnerExtDto.notes = "";
    this.selectedHouseOwnerExtDto.avatarUrl = "";
    this.selectedHouseOwnerExtDto.createdAt = new Date();
    this.selectedHouseOwnerExtDto.updatedAt = new Date();

    // Extended With Account
    this.selectedHouseOwnerExtDto.accountGroupId = 0;
    this.selectedHouseOwnerExtDto.accountOrder = 0;
    this.selectedHouseOwnerExtDto.accountName = "";
    this.selectedHouseOwnerExtDto.accountCode = "";
    this.selectedHouseOwnerExtDto.taxOffice = "";
    this.selectedHouseOwnerExtDto.taxNumber = 0;
    this.selectedHouseOwnerExtDto.identityNumber = 0;
    this.selectedHouseOwnerExtDto.limit = 0;
    this.selectedHouseOwnerExtDto.standartMaturity = 0;
  }

  save(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    if (selectedHouseOwnerExtDto.houseOwnerId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }


  select(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.setHeader(selectedHouseOwnerExtDto.houseOwnerId);

    this.selectedHouseOwnerExtDto = cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO);

    if (selectedHouseOwnerExtDto.houseOwnerId != 0) {
      this.sub7 = this.houseOwnerExtService.getExtById(selectedHouseOwnerExtDto.houseOwnerId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedHouseOwnerExtDto = response.data;
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(houseOwnerId: number): void {
    houseOwnerId == 0 ? this.cardHeader = "Mülk Sahibi Ekle" : this.cardHeader = "Mülk Sahibini Düzenle";
  }

  updateExt(): void {
    let isModelValid = this.validateForUpdate();

    if (isModelValid) {
      this.sub8 = this.houseOwnerExtService.updateExt(this.selectedHouseOwnerExtDto).subscribe({
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
      console.log(this.selectedHouseOwnerExtDtoErrors);
    }
  }

  validateForAdd(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedHouseOwnerExtDto.nameSurname)) {
      this.selectedHouseOwnerExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedHouseOwnerExtDto.phone)) {
      this.selectedHouseOwnerExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.stringPreciseLength(this.selectedHouseOwnerExtDto.phone, 10)) {
      this.selectedHouseOwnerExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.branchId)) {
      this.selectedHouseOwnerExtDtoErrors.branchId = "Lütfen şube seçiniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedHouseOwnerExtDto.accountName)) {
      this.selectedHouseOwnerExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedHouseOwnerExtDto.accountCode)) {
      this.selectedHouseOwnerExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedHouseOwnerExtDto.taxOffice)) {
      this.selectedHouseOwnerExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.taxNumber)) {
      this.selectedHouseOwnerExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.identityNumber)) {
      this.selectedHouseOwnerExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.numberPreciseLength(this.selectedHouseOwnerExtDto.identityNumber, 11)) {
      this.selectedHouseOwnerExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.limit)) {
      this.selectedHouseOwnerExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.standartMaturity)) {
      this.selectedHouseOwnerExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";
      isValid = false;
    }

    return isValid;
  }

  validateForGeneratingAccountCode(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.number(this.selectedHouseOwnerExtDto.branchId)) {
      this.selectedHouseOwnerExtDtoErrors.branchId = "Lütfen şube seçiniz.";
      isValid = false;
    }

    return isValid;
  }

  validateForUpdate(): boolean {
    this.resetErrors();

    let isValid: boolean = true;

    if (!this.validationService.string(this.selectedHouseOwnerExtDto.nameSurname)) {
      this.selectedHouseOwnerExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedHouseOwnerExtDto.accountName)) {
      this.selectedHouseOwnerExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";
      isValid = false;
    }
    if (!this.validationService.string(this.selectedHouseOwnerExtDto.taxOffice)) {
      this.selectedHouseOwnerExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.taxNumber)) {
      this.selectedHouseOwnerExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.identityNumber)) {
      this.selectedHouseOwnerExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";
      isValid = false;
    }
    if (!this.validationService.numberPreciseLength(this.selectedHouseOwnerExtDto.identityNumber, 11)) {
      this.selectedHouseOwnerExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.limit)) {
      this.selectedHouseOwnerExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
      isValid = false;
    }
    if (!this.validationService.number(this.selectedHouseOwnerExtDto.standartMaturity)) {
      this.selectedHouseOwnerExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";
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
