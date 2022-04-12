import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { AccountGroupCodesDto } from 'src/app/models/dtos/account-group-codes-dto';
import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AccountService } from 'src/app/services/account.service';
import { AccountGetByAccountGroupCodesDto } from 'src/app/models/dtos/account-get-by-account-group-codes-dto';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { ToastService } from 'src/app/services/toast.service';

const ACCOUNT_EXT_DTO_ERRORS: AccountExtDtoErrors = {
  accountId: "",
  businessId: "",
  branchId: "",
  accountGroupId: "",
  currencyId: "",
  accountOrder: "",
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: "",
  identityNumber: "",
  debitBalance: "",
  creditBalance: "",
  balance: "",
  limit: "",
  standartMaturity: "",
  createdAt: "",
  updatedAt: "",

  // Extended With Branch
  branchName: "",

  // Extended With AccountGroup
  accountGroupName: "",
  accountGroupCode: "",

  // Extended With Currency
  currencyName: "",

  // Added Custom Fields
  accountTypeName: "",
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  notes: "",
  avatarUrl: "",
};

const EMPTY_ACCOUNT_EXT_DTO: AccountExtDto = {
  accountId: 0,
  businessId: 0,
  branchId: 0,
  accountGroupId: 0,
  currencyId: 0,
  accountOrder: 0,
  accountName: "",
  accountCode: "",
  taxOffice: "",
  taxNumber: undefined,
  identityNumber: undefined,
  debitBalance: 0,
  creditBalance: 0,
  balance: 0,
  limit: 0,
  standartMaturity: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Branch
  branchName: "",

  // Extended With AccountGroup
  accountGroupName: "",
  accountGroupCode: "",

  // Extended With Currency
  currencyName: "",

  // Added Custom Fields
  accountTypeName: "",
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: new Date(),
  gender: "",
  notes: "",
  avatarUrl: "",
};

const EMPTY_ACCOUNT_GET_BY_ACCOUNT_GROUP_CODES_DTO: AccountGetByAccountGroupCodesDto = {
  businessId: 0,
  accountGroupCodes: [],
};

const EMPTY_ACCOUNT_GROUP_CODES_DTO: AccountGroupCodesDto = {
  accountGroupCodes: [],
};

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public accountExtDtos$!: Observable<ListDataResult<AccountExtDto>>;
  public accountGroupDtos: AccountGroupDto[] = [];
  public accountGetByAccountGroupCodesDto: AccountGetByAccountGroupCodesDto = cloneDeep(EMPTY_ACCOUNT_GET_BY_ACCOUNT_GROUP_CODES_DTO);
  public accountGroupCodesDto: AccountGroupCodesDto = cloneDeep(EMPTY_ACCOUNT_GROUP_CODES_DTO);
  public activePage: string = "list";
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public cardHeader: string = "";
  public loading: boolean = false;
  public selectedAccountExtDto: AccountExtDto = cloneDeep(EMPTY_ACCOUNT_EXT_DTO);
  public selectedAccountExtDtoErrors: AccountExtDtoErrors = cloneDeep(ACCOUNT_EXT_DTO_ERRORS);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  public sub7: Subscription = new Subscription();
  public sub8: Subscription = new Subscription();
  
  constructor(
    private accountService: AccountService,
    private accountGroupService: AccountGroupService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) { 
    console.log("AccountComponent constructor çalıştı.");

    this.getAllAccountGroups();

    // Sunucudan bazı cari hesapları getirir ve modellere doldurur.
    this.accountGetByAccountGroupCodesDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.accountGetByAccountGroupCodesDto.accountGroupCodes = ["120", "320", "335"];
    this.getAccountExtsByBusinessIdAndAccountGroupCodes(this.accountGetByAccountGroupCodesDto);

    this.getBranchsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(selectedAccountExtDto: AccountExtDto): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    selectedAccountExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let isModelValid = this.validateForAdd(selectedAccountExtDto);

    if (isModelValid) {
      this.loading = true;

      this.sub1 = this.accountService.addExt(selectedAccountExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
          this.loading = false;
  
          this.accountGetByAccountGroupCodesDto.businessId = this.authorizationService.authorizationDto.businessId;
          this.accountGetByAccountGroupCodesDto.accountGroupCodes = ["120", "320", "335"];
          return this.accountExtDtos$ = this.accountService.getExtsByBusinessIdAndAccountGroupCodes(this.accountGetByAccountGroupCodesDto);
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
      console.log(this.selectedAccountExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedAccountExtDto: AccountExtDto): void {
    this.selectedAccountExtDto = cloneDeep(EMPTY_ACCOUNT_EXT_DTO);

    this.sub2 = this.accountService.getExtById(selectedAccountExtDto.accountId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedAccountExtDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.accountService.deleteExt(selectedAccountExtDto.accountId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);

                  this.accountGetByAccountGroupCodesDto.businessId = this.authorizationService.authorizationDto.businessId;
                  this.accountGetByAccountGroupCodesDto.accountGroupCodes = ["120", "320", "335"];
                  return this.accountExtDtos$ = this.accountService.getExtsByBusinessIdAndAccountGroupCodes(this.accountGetByAccountGroupCodesDto);
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

  generateAccountCode(selectedAccountExtDto: AccountExtDto) {
    // Seçili hesap grubunun id'sinden hesap grubu kodu bulunur.
    const selectedAccountGroupDtos: AccountGroupDto[] = this.accountGroupDtos.filter(a => 
      a.accountGroupId == selectedAccountExtDto.accountGroupId);

    let isModelValid = this.validateForGeneratingAccountCode(selectedAccountExtDto);

    if (isModelValid) {      
      this.sub4 = this.accountService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.authorizationService.authorizationDto.branchId, 
        selectedAccountGroupDtos[0].accountGroupCode).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedAccountExtDto.accountOrder = response.data.accountOrder;
            this.selectedAccountExtDto.accountCode = response.data.accountCode;
          }
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedAccountExtDtoErrors);
    }
  }

  getAccountExtById(id: number): void {
    this.sub5 = this.accountService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedAccountExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getAccountExtsByBusinessIdAndAccountGroupCodes(accountGetByAccountGroupCodesDto: AccountGetByAccountGroupCodesDto): void {
    this.accountExtDtos$ = this.accountService.getExtsByBusinessIdAndAccountGroupCodes(accountGetByAccountGroupCodesDto);
  }

  getAllAccountGroups(): void {
    this.sub6 = this.accountGroupService.getAll().subscribe({
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

  save(selectedAccountExtDto: AccountExtDto): void {
    if (selectedAccountExtDto.accountId == 0) {
      this.addExt(selectedAccountExtDto);
    } else {
      this.updateExt(selectedAccountExtDto);
    }
  }

  select(selectedAccountExtDto: AccountExtDto): void {
    this.setHeader(selectedAccountExtDto.accountId);

    this.selectedAccountExtDto = cloneDeep(EMPTY_ACCOUNT_EXT_DTO);

    if (selectedAccountExtDto.accountId != 0) {
      this.sub7 = this.accountService.getExtById(selectedAccountExtDto.accountId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedAccountExtDto = response.data;
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(accountId: number): void {
    accountId == 0 ? this.cardHeader = "Cari Hesap Ekle" : this.cardHeader = "Cari Hesabı Düzenle";
  }

  updateExt(selectedAccountExtDto: AccountExtDto): void {
    let isModelValid = this.validateForAdd(selectedAccountExtDto);

    if (isModelValid) {
      this.sub8 = this.accountService.updateExt(selectedAccountExtDto).subscribe({
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
      console.log(this.selectedAccountExtDtoErrors);
    }
  }

  validateForAdd(selectedAccountExtDto: AccountExtDto): boolean {
    this.selectedAccountExtDtoErrors = cloneDeep(ACCOUNT_EXT_DTO_ERRORS);
    let isValid: boolean = true;
    if (selectedAccountExtDto.accountTypeName == "") {
      this.selectedAccountExtDtoErrors.accountTypeName = "Lütfen hesap tipi seçiniz.";
      isValid = false;
    } 
    if (selectedAccountExtDto.accountGroupId == 0) {
      this.selectedAccountExtDtoErrors.accountGroupId = "Lütfen hesap grubu seçiniz.";
      isValid = false;
    } 
    if (selectedAccountExtDto.nameSurname == "") {
      this.selectedAccountExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.phone == "") {
      this.selectedAccountExtDtoErrors.phone = "Lütfen hesap sahibinin telefon numarasını giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.phone.length != 10) {
      this.selectedAccountExtDtoErrors.phone = "Telefon numarasını başında sıfır olmadan 10 haneden olarak giriniz. Örneğin; 555 444 33 22";
      isValid = false;
    }
    if (selectedAccountExtDto.branchId == 0) {
      this.selectedAccountExtDtoErrors.branchId = "Lütfen şube seçiniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.accountName == "") {
      this.selectedAccountExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.accountCode == "") {
      this.selectedAccountExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.taxOffice == "") {
      this.selectedAccountExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.taxNumber == undefined || selectedAccountExtDto.taxNumber <= 0) {
      this.selectedAccountExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.identityNumber == undefined || selectedAccountExtDto.identityNumber <= 0) {
      this.selectedAccountExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.identityNumber == undefined || selectedAccountExtDto.identityNumber < 10000000000 || selectedAccountExtDto.identityNumber > 99999999999) {
      this.selectedAccountExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";
      isValid = false;
    }
    if (selectedAccountExtDto.limit <= 0) {
      this.selectedAccountExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.standartMaturity <= 0) {
      this.selectedAccountExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";
      isValid = false;
    }
    return isValid;
  }

  validateForGeneratingAccountCode(selectedAccountExtDto: AccountExtDto): boolean {
    this.selectedAccountExtDtoErrors = cloneDeep(ACCOUNT_EXT_DTO_ERRORS);
    let isValid: boolean = true;
    if (selectedAccountExtDto.accountTypeName == "") {
      this.selectedAccountExtDtoErrors.accountTypeName = "Lütfen hesap tipi seçiniz.";
      isValid = false;
    } 
    if (selectedAccountExtDto.accountGroupId == 0) {
      this.selectedAccountExtDtoErrors.accountGroupId = "Lütfen hesap grubu seçiniz.";
      isValid = false;
    } 
    if (selectedAccountExtDto.branchId == 0) {
      this.selectedAccountExtDtoErrors.branchId = "Lütfen şube seçiniz.";
      isValid = false;
    }
    return isValid;
  }

  validateForUpdate(selectedAccountExtDto: AccountExtDto): boolean {
    this.selectedAccountExtDtoErrors = cloneDeep(ACCOUNT_EXT_DTO_ERRORS);
    let isValid: boolean = true;
    if (selectedAccountExtDto.nameSurname == "") {
      this.selectedAccountExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.accountName == "") {
      this.selectedAccountExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.taxOffice == "") {
      this.selectedAccountExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.taxNumber == undefined || selectedAccountExtDto.taxNumber <= 0) {
      this.selectedAccountExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.identityNumber == undefined || selectedAccountExtDto.identityNumber <= 0) {
      this.selectedAccountExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.identityNumber == undefined || selectedAccountExtDto.identityNumber < 10000000000 || selectedAccountExtDto.identityNumber > 99999999999) {
      this.selectedAccountExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";
      isValid = false;
    }
    if (selectedAccountExtDto.limit <= 0) {
      this.selectedAccountExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
      isValid = false;
    }
    if (selectedAccountExtDto.standartMaturity <= 0) {
      this.selectedAccountExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";
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
