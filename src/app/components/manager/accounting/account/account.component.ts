import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY, from, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { AccountGetByAccountGroupCodesDto } from 'src/app/models/dtos/account-get-by-account-group-codes-dto';
import { AccountGroupCodesDto } from 'src/app/models/dtos/account-group-codes-dto';
import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { AccountTypeDto } from 'src/app/models/dtos/account-type-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { RouteHistory } from 'src/app/models/various/route-history';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AccountTypeService } from 'src/app/services/account-type.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { CashExtService } from 'src/app/services/cash-ext.service';
import { EmployeeExtService } from 'src/app/services/employee-ext.service';
import { HouseOwnerExtService } from 'src/app/services/house-owner-ext.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TenantExtService } from 'src/app/services/tenant-ext.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  @ViewChild('deleteCashModal') deleteCashModal!: ElementRef;
  @ViewChild('deleteEmployeeModal') deleteEmployeeModal!: ElementRef;
  @ViewChild('deleteHouseOwnerModal') deleteHouseOwnerModal!: ElementRef;
  @ViewChild('deleteTenantModal') deleteTenantModal!: ElementRef;
  @ViewChild('deleteAccountModal') deleteAccountModal!: ElementRef;
  
  public accountExtDtos$!: Observable<ListDataResult<AccountExtDto>>;
  public accountGroupDtos!: AccountGroupDto[];
  public accountTypeDtos!: AccountTypeDto[];
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public accountGetByAccountGroupCodesDto: AccountGetByAccountGroupCodesDto;
  public accountGroupCodesDto: AccountGroupCodesDto;
  public activePage: string = "list";
  public cardHeader: string = "";
  public loading: boolean = false;
  public selectedAccountExtDto: AccountExtDto;
  public selectedAccountExtDtoErrors: AccountExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private accountExtService: AccountExtService,
    private accountGroupService: AccountGroupService,
    private accountTypeService: AccountTypeService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private cashExtService: CashExtService,
    private employeeExtService: EmployeeExtService,
    private houseOwnerExtService: HouseOwnerExtService,
    private modalService: NgbModal,
    private navigationService: NavigationService,
    private router: Router,
    private tenantExtService: TenantExtService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("AccountComponent constructor çalıştı.");

    this.accountGetByAccountGroupCodesDto = this.accountExtService.emptyAccountGetByAccountGroupCodesDto;
    this.accountGroupCodesDto = this.accountExtService.emptyAccountGroupCodesDto;
    this.selectedAccountExtDto = this.accountExtService.emptyAccountExtDto;
    this.selectedAccountExtDtoErrors = this.accountExtService.emptyAccountExtDtoErrors;

    this.getAllAccountGroups();
    this.getAllAccountTypes();
    this.branchDtos$ = this.getBranchesByBusinessId();

    // Sunucudan bazı cari hesapları getirir ve modellere doldurur.
    //this.accountExtDtos$ = this.getAccountExtsByBusinessIdAndAccountGroupCodes();
    // Geliştirme aşamasında tüm cari hesapları getirmeliyim. 
    this.accountExtDtos$ = this.getAccountExtsByBusinessId();
  }

  add(type: string): void {
    this.selectedAccountExtDto = this.accountExtService.emptyAccountExtDto;
    this.selectedAccountExtDto.accountTypeName = type;
    this.fillRouteHistoryAndNavigate(this.selectedAccountExtDto);
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

          return this.getAccountExtsByBusinessId();
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
    this.selectedAccountExtDto = selectedAccountExtDto;
    console.log(selectedAccountExtDto.accountTypeName);

    from(this.modalService.open(this.deleteEmployeeModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          if (selectedAccountExtDto.accountTypeName == "Kasa") {
            return this.cashExtService.deleteExtByAccountId(selectedAccountExtDto.accountId)
            .pipe(
              tap((response) => {
                this.toastService.success(response.message);
              })
            );
          } else if (selectedAccountExtDto.accountTypeName == "Personel") {
            return this.employeeExtService.deleteExtByAccountId(selectedAccountExtDto.accountId)
            .pipe(
              tap((response) => {
                this.toastService.success(response.message);
              })
            );
          } else if (selectedAccountExtDto.accountTypeName == "Mülk Sahibi") {
            return this.houseOwnerExtService.deleteExtByAccountId(selectedAccountExtDto.accountId)
            .pipe(
              tap((response) => {
                this.toastService.success(response.message);
              })
            );
          } else if (selectedAccountExtDto.accountTypeName == "Kiracı") {
            return this.tenantExtService.deleteExtByAccountId(selectedAccountExtDto.accountId)
            .pipe(
              tap((response) => {
                this.toastService.success(response.message);
              })
            );
          } else if (selectedAccountExtDto.accountTypeName == "Diğer") {
            return this.accountExtService.deleteExt(selectedAccountExtDto.accountId)
            .pipe(
              tap((response) => {
                this.toastService.success(response.message);
              })
            );
          }
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getAccountExtsByBusinessId();
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

  fillRouteHistoryAndNavigate(selectedAccountExtDto: AccountExtDto): void {
    if (selectedAccountExtDto.accountTypeName == "Kasa") {
      const routeHistory: RouteHistory = {
        previousRoute: "manager/accounting/account",
        accountId: selectedAccountExtDto.accountId,
      };
      this.navigationService.routeHistory = routeHistory;
      this.router.navigate(["manager/accounting/cash"]);
    } else if (selectedAccountExtDto.accountTypeName == "Personel") {
      const routeHistory: RouteHistory = {
        previousRoute: "manager/accounting/account",
        accountId: selectedAccountExtDto.accountId,
      };
      this.navigationService.routeHistory = routeHistory;
      this.router.navigate(["manager/person-management/employee"]);
    } else if (selectedAccountExtDto.accountTypeName == "Mülk Sahibi") {
      const routeHistory: RouteHistory = {
        previousRoute: "manager/accounting/account",
        accountId: selectedAccountExtDto.accountId,
      };
      this.navigationService.routeHistory = routeHistory;
      this.router.navigate(["manager/person-management/house-owner"]);
    } else if (selectedAccountExtDto.accountTypeName == "Kiracı") {
      const routeHistory: RouteHistory = {
        previousRoute: "manager/accounting/account",
        accountId: selectedAccountExtDto.accountId,
      };
      this.navigationService.routeHistory = routeHistory;
      this.router.navigate(["manager/person-management/tenant"]);
    } else if (selectedAccountExtDto.accountTypeName == "Diğer") {
      this.selectedAccountExtDto = this.accountExtService.emptyAccountExtDto;
      this.setHeader(selectedAccountExtDto.accountId);
      if (selectedAccountExtDto.accountId != 0) {
        this.getAccountExtById(selectedAccountExtDto.accountId);
      }
      this.selectedAccountExtDto.accountTypeId = this.findAccountTypeId("Diğer");
      this.activePage = "detail";
    }
  }

  findAccountGroupCode(accountGroupId: number): string {
    const searchedAccountGroupInArray = this.accountGroupDtos.filter(a => a.accountGroupId == accountGroupId);
    return searchedAccountGroupInArray[0].accountGroupCode;
  }

  findAccountTypeId(accountTypeName: string): number {
    const searchedAccountTypeInArray = this.accountTypeDtos.filter(a => a.accountTypeName == accountTypeName);
    return searchedAccountTypeInArray[0].accountTypeId;
  }

  generateAccountCode(): void {
    let [isModelValid, errors] = this.validationService.validateAccountExtDto(this.selectedAccountExtDto, "code");
    this.selectedAccountExtDtoErrors = errors;
    if (isModelValid) {
      this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId,
        this.selectedAccountExtDto.branchId,
        this.findAccountGroupCode(this.selectedAccountExtDto.accountGroupId))
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

  getAccountExtById(accountId: number) {
    this.accountExtService.getExtById(accountId)
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

  getAccountExtsByBusinessId(): Observable<ListDataResult<AccountExtDto>> {
    this.accountExtDtos$ = this.accountExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.accountExtDtos$;
  }

  getAccountExtsByBusinessIdAndAccountGroupCodes(): Observable<ListDataResult<AccountExtDto>> {
    this.accountGetByAccountGroupCodesDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.accountGetByAccountGroupCodesDto.accountGroupCodes = ["120", "320", "335"];
    this.accountExtDtos$ = this.accountExtService.getExtsByBusinessIdAndAccountGroupCodes(this.accountGetByAccountGroupCodesDto);
    return this.accountExtDtos$;
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

  getAllAccountTypes(): void {
    this.accountTypeService.getAll()
    .pipe(
      takeUntil(this.unsubscribeAll),
    ).subscribe({
      next: (response) => {
        this.accountTypeDtos = response.data;
      }, error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
      }
    });
  }

  getBranchesByBusinessId(): Observable<ListDataResult<BranchDto>> {
    this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.branchDtos$;
  }

  resetAccountCodeProperties(): void{
    this.selectedAccountExtDto.accountOrder = 0;
    this.selectedAccountExtDto.accountCode = "";
  }

  save(selectedAccountExtDto: AccountExtDto): void {
    if (selectedAccountExtDto.accountId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  setHeader(accountId: number): void {
    accountId == 0 ? this.cardHeader = "Cari Hesap Ekle" : this.cardHeader = "Cari Hesabı Düzenle";
  }

  update(selectedAccountExtDto: AccountExtDto): void {
    this.fillRouteHistoryAndNavigate(selectedAccountExtDto);
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
