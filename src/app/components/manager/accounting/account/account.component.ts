import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { AccountGetByAccountGroupCodesDto } from 'src/app/models/dtos/account-get-by-account-group-codes-dto';
import { AccountGroupCodesDto } from 'src/app/models/dtos/account-group-codes-dto';
import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { AccountType } from 'src/app/models/various/account-type';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { HouseOwnerExtService } from 'src/app/services/house-owner-ext.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public accountExtDtos$!: Observable<ListDataResult<AccountExtDto>>;
  public accountGroupDtos: AccountGroupDto[] = [];
  public accountGetByAccountGroupCodesDto: AccountGetByAccountGroupCodesDto;
  public accountGroupCodesDto: AccountGroupCodesDto;
  public activePage: string = "list";
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public cardHeader: string = "";
  public loading: boolean = false;
  public sectionManagerAccountTypes: AccountType[] = [
    { accountTypeName: "Diğer" },
    { accountTypeName: "Personel" },
    { accountTypeName: "Ev Sahibi" },
    { accountTypeName: "Kiracı" },
  ];
  public selectedAccountExtDto: AccountExtDto;
  public selectedAccountExtDtoErrors: AccountExtDtoErrors;
  public selectedHouseOwnerExtDto: HouseOwnerExtDto;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
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
    console.log("AccountComponent constructor çalıştı.");

    this.accountGetByAccountGroupCodesDto = this.accountExtService.emptyAccountGetByAccountGroupCodesDto;
    this.accountGroupCodesDto = this.accountExtService.emptyAccountGroupCodesDto;
    this.selectedAccountExtDto = this.accountExtService.emptyAccountExtDto;
    this.selectedAccountExtDtoErrors = this.accountExtService.emptyAccountExtDtoErrors;
    this.selectedHouseOwnerExtDto = this.houseOwnerExtService.emptyHouseOwnerExtDto;

    this.getAllAccountGroups();

    // Sunucudan bazı cari hesapları getirir ve modellere doldurur.
    this.accountExtDtos$ = this.getAccountExtsByBusinessIdAndAccountGroupCodes();

    this.branchDtos$ = this.getBranchsByBusinessId();
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedAccountExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateAccountExtDto(this.selectedAccountExtDto, "add");
    this.selectedAccountExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.accountExtService.addExt(this.selectedAccountExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;
  
          return this.getAccountExtsByBusinessIdAndAccountGroupCodes();
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
    this.accountExtService.getExtById(selectedAccountExtDto.accountId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedAccountExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.accountExtService.deleteExt(selectedAccountExtDto.accountId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getAccountExtsByBusinessIdAndAccountGroupCodes();
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

  generateAccountCode(accountGroupId: number): void {
    // Seçili hesap grubunun id'sinden hesap grubu kodu bulunur.
    const selectedAccountGroupDtos: AccountGroupDto[] = this.accountGroupDtos.filter(a => 
      a.accountGroupId == accountGroupId);

    let [isModelValid, errors] = this.validationService.validateAccountExtDto(this.selectedAccountExtDto, "code");
    this.selectedAccountExtDtoErrors = errors;
    if (isModelValid) {      
      this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.authorizationService.authorizationDto.branchId, 
        selectedAccountGroupDtos[0].accountGroupCode)
        .pipe(
          takeUntil(this.unsubscribeAll),
        ).subscribe({
        next: (response) => {
          this.selectedAccountExtDto.accountOrder = response.data.accountOrder;
          this.selectedAccountExtDto.accountCode = response.data.accountCode;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedAccountExtDtoErrors);
    }
  }

  getAccountExtsByBusinessIdAndAccountGroupCodes(): Observable<ListDataResult<AccountExtDto>> {
    this.accountGetByAccountGroupCodesDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.accountGetByAccountGroupCodesDto.accountGroupCodes = ["120", "320", "335"];
    return this.accountExtService.getExtsByBusinessIdAndAccountGroupCodes(this.accountGetByAccountGroupCodesDto);
  }

  getAllAccountGroups(): void {
    this.accountGroupService.getAll()
    .pipe(
      takeUntil(this.unsubscribeAll),
    ).subscribe({
      next: (response) => {
        this.accountGroupDtos = response.data;
      }, error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
      }
    });
  }

  getBranchsByBusinessId(): Observable<ListDataResult<BranchDto>> {
    return this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  resetModel(): void {
    this.selectedAccountExtDto.accountId = 0;
    this.selectedAccountExtDto.businessId = 0;
    this.selectedAccountExtDto.branchId = 0;
    this.selectedAccountExtDto.accountGroupId = 0;
    this.selectedAccountExtDto.accountTypeId = 0;
    this.selectedAccountExtDto.accountOrder = 0;
    this.selectedAccountExtDto.accountName = "";
    this.selectedAccountExtDto.accountCode = "";
    this.selectedAccountExtDto.taxOffice = "";
    this.selectedAccountExtDto.taxNumber = undefined;
    this.selectedAccountExtDto.identityNumber = undefined;
    this.selectedAccountExtDto.debitBalance = 0;
    this.selectedAccountExtDto.creditBalance = 0;
    this.selectedAccountExtDto.balance = 0;
    this.selectedAccountExtDto.limit = 0;
    this.selectedAccountExtDto.standartMaturity = 0;
    this.selectedAccountExtDto.createdAt = new Date();
    this.selectedAccountExtDto.updatedAt = new Date();

    // Extended With Branch
    this.selectedAccountExtDto.branchName = "";

    // Extended With AccountGroup
    this.selectedAccountExtDto.accountGroupName = "";
    this.selectedAccountExtDto.accountGroupCode = "";

    // Extended With AccountType
    this.selectedAccountExtDto.accountTypeName = "";

    // Added Custom Required Fields
    this.selectedAccountExtDto.nameSurname = "";
    this.selectedAccountExtDto.phone = "";
  }

  save(selectedAccountExtDto: AccountExtDto): void {
    if (selectedAccountExtDto.accountId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedAccountExtDto: AccountExtDto): void {
    this.selectedAccountExtDto = this.accountExtService.emptyAccountExtDto;

    if (!selectedAccountExtDto) {
      selectedAccountExtDto = this.accountExtService.emptyAccountExtDto;
    }

    this.setHeader(selectedAccountExtDto.accountId);

    if (selectedAccountExtDto.accountId != 0) {
      this.accountExtService.getExtById(selectedAccountExtDto.accountId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedAccountExtDto = response.data;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  selectAccountGroup() {
    this.selectedAccountExtDto.accountCode = "";
    this.selectedAccountExtDto.accountOrder = 0;
  }

  selectAccountType(accountTypeName: string) {
    this.resetModel();
    let selectedAccountTypeInArray = [];
    if (accountTypeName == "Ev Sahibi") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "120");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
      this.selectedAccountExtDto.accountTypeName = "Ev Sahibi";
    } else if (accountTypeName == "Kiracı") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "120");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
      this.selectedAccountExtDto.accountTypeName = "Kiracı";
    } else if (accountTypeName == "Personel") {
      selectedAccountTypeInArray = this.accountGroupDtos.filter(a => a.accountGroupCode == "335");
      this.selectedAccountExtDto.accountGroupId = selectedAccountTypeInArray[0].accountGroupId;
      this.selectedAccountExtDto.accountTypeName = "Personel";
    } else if (accountTypeName == "Diğer") {
      this.selectedAccountExtDto.accountGroupId = 0;
      this.selectedAccountExtDto.accountTypeName = "Diğer";
    }
  }

  setHeader(accountId: number): void {
    accountId == 0 ? this.cardHeader = "Cari Hesap Ekle" : this.cardHeader = "Cari Hesabı Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateAccountExtDto(this.selectedAccountExtDto, "update");
    this.selectedAccountExtDtoErrors = errors;
    if (isModelValid) {
      this.accountExtService.updateExt(this.selectedAccountExtDto)
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
      console.log(this.selectedAccountExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
