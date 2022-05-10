import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { CashExtDto } from 'src/app/models/dtos/cash-ext-dto';
import { CashExtDtoErrors } from 'src/app/models/validation-errors/cash-ext-dto-errors';
import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { RouteHistory } from 'src/app/models/various/route-history';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { CashExtService } from 'src/app/services/cash-ext.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.scss']
})
export class CashComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public cardHeader: string = "";
  public cashExtDtos$!: Observable<ListDataResult<CashExtDto>>;
  public currencyDtos$!: Observable<ListDataResult<CurrencyDto>>;
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public loading: boolean = false;
  public selectedCashExtDto: CashExtDto;
  public selectedCashExtDtoErrors: CashExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private accountExtService: AccountExtService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private cashExtService: CashExtService,
    private currencyService: CurrencyService,
    private modalService: NgbModal,
    private navigationService: NavigationService,
    private router: Router,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("CashComponent constructor çalıştı.");

    this.selectedCashExtDto = this.cashExtService.emptyCashExtDto;
    this.selectedCashExtDtoErrors = this.cashExtService.emptyCashExtDtoErrors;

    this.branchDtos$ = this.getBranchsByBusinessId();
    this.currencyDtos$ = this.getAllCurrencies();

    this.navigate(this.navigationService.routeHistory);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedCashExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateCashExtDto(this.selectedCashExtDto, "add");
    this.selectedCashExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.cashExtService.addExt(this.selectedCashExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.navigateOnCompletion(this.navigationService.routeHistory);
          window.scroll(0,0);
          this.loading = false;
  
          return this.getCashExtsByBusinessId();
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
      console.log(this.selectedCashExtDtoErrors);
    }
  }

  cancel(): void {
    this.navigateOnCompletion(this.navigationService.routeHistory);
    window.scroll(0,0);
  }

  delete(selectedCashExtDto: CashExtDto): void {
    this.cashExtService.getExtById(selectedCashExtDto.cashId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedCashExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.cashExtService.deleteExt(selectedCashExtDto.cashId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getCashExtsByBusinessId();
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

  generateAccountCode(): void {
    let [isModelValid, errors] = this.validationService.validateCashExtDto(this.selectedCashExtDto, "code");
    this.selectedCashExtDtoErrors = errors;
    if (isModelValid) {      
      this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.selectedCashExtDto.branchId, 
        "100")
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedCashExtDto.accountOrder = response.data.accountOrder;
          this.selectedCashExtDto.accountCode = response.data.accountCode;
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedCashExtDtoErrors);
    }
  }

  getAllCurrencies() {
    this.currencyDtos$ = this.currencyService.getAll();
    return this.currencyDtos$;
  }

  getBranchsByBusinessId(): Observable<ListDataResult<BranchDto>> {
    this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.branchDtos$;
  }

  getCashExtsByBusinessId(): Observable<ListDataResult<CashExtDto>> {
    this.cashExtDtos$ = this.cashExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.cashExtDtos$;
  }

  navigate(routeHistory: RouteHistory) {
    if (routeHistory.previousRoute != "") {
      if (routeHistory.accountId != 0) {
        this.cashExtService.getExtByAccountId(routeHistory.accountId)
        .pipe(
          takeUntil(this.unsubscribeAll),
        ).subscribe({
          next: (response) => {
            this.selectedCashExtDto = response.data;
          }, error: (error) => {
            console.log(error);
            this.toastService.danger(error.message);
          }
        });
      }

      this.activePage = "detail";
    } else {
      this.cashExtDtos$ = this.getCashExtsByBusinessId();
    }
  }

  navigateOnCompletion(routeHistory: RouteHistory) {
    if (routeHistory.previousRoute) {
      this.router.navigate([`${routeHistory.previousRoute}`]);
      this.navigationService.routeHistory = this.navigationService.emptyRouteHistory;
    } else {
      this.activePage = "list";
    }
  }

  save(selectedCashExtDto: CashExtDto): void {
    if (selectedCashExtDto.cashId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedCashExtDto: CashExtDto): void {
    this.selectedCashExtDto = this.cashExtService.emptyCashExtDto;
    
    if (!selectedCashExtDto) {  
      selectedCashExtDto = this.cashExtService.emptyCashExtDto;    
    } 

    this.setHeader(selectedCashExtDto.cashId);

    if (selectedCashExtDto.cashId != 0) {
      this.cashExtService.getExtById(selectedCashExtDto.cashId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedCashExtDto = response.data;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(cashId: number): void {
    cashId == 0 ? this.cardHeader = "Kasa Ekle" : this.cardHeader = "Kasayı Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateCashExtDto(this.selectedCashExtDto, "update");
    this.selectedCashExtDtoErrors = errors;
    if (isModelValid) {
      this.cashExtService.updateExt(this.selectedCashExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.navigateOnCompletion(this.navigationService.routeHistory);
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
      console.log(this.selectedCashExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
