import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY, from, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BankExtDto } from 'src/app/models/dtos/bank-ext-dto';
import { BankExtDtoErrors } from 'src/app/models/validation-errors/bank-ext-dto-errors';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { CityDto } from 'src/app/models/dtos/city-dto';
import { CurrencyDto } from 'src/app/models/dtos/currency-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { RouteHistory } from 'src/app/models/various/route-history';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BankExtService } from 'src/app/services/bank-ext.service';
import { BranchService } from 'src/app/services/branch.service';
import { CityService } from 'src/app/services/city.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { DistrictService } from 'src/app/services/district.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public bankExtDtos$!: Observable<ListDataResult<BankExtDto>>;
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public cardHeader: string = "";
  public cityDtos$!: Observable<ListDataResult<CityDto>>;
  public currencyDtos$!: Observable<ListDataResult<CurrencyDto>>;
  public districtDtos$!: Observable<ListDataResult<DistrictDto>>;
  public loading: boolean = false;
  public selectedBankExtDto: BankExtDto;
  public selectedBankExtDtoErrors: BankExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private accountExtService: AccountExtService,
    private authorizationService: AuthorizationService,
    private bankExtService: BankExtService,
    private branchService: BranchService,
    private cityService: CityService,
    private currencyService: CurrencyService,
    private districtService: DistrictService,
    private modalService: NgbModal,
    private navigationService: NavigationService,
    private router: Router,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("BankComponent constructor çalıştı.");

    this.selectedBankExtDto = this.bankExtService.emptyBankExtDto;
    this.selectedBankExtDtoErrors = this.bankExtService.emptyBankExtDtoErrors;

    this.branchDtos$ = this.getBranchsByBusinessId();
    this.cityDtos$ = this.getAllCities();
    this.currencyDtos$ = this.getAllCurrencies();

    this.navigate(this.navigationService.routeHistory);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedBankExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateBankExtDto(this.selectedBankExtDto, "add");
    this.selectedBankExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.bankExtService.addExt(this.selectedBankExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.navigateOnCompletion(this.navigationService.routeHistory);
          window.scroll(0,0);
          this.loading = false;
  
          return this.getBankExtsByBusinessId();
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
      console.log(this.selectedBankExtDtoErrors);
    }
  }

  cancel(): void {
    this.navigateOnCompletion(this.navigationService.routeHistory);
    window.scroll(0,0);
  }

  delete(selectedBankExtDto: BankExtDto): void {
    this.selectedBankExtDto = selectedBankExtDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.bankExtService.deleteExt(selectedBankExtDto.bankId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getBankExtsByBusinessId();
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
    let [isModelValid, errors] = this.validationService.validateBankExtDto(this.selectedBankExtDto, "code");
    this.selectedBankExtDtoErrors = errors;
    if (isModelValid) {      
      this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.selectedBankExtDto.branchId, 
        "102")
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedBankExtDto.accountOrder = response.data.accountOrder;
          this.selectedBankExtDto.accountCode = response.data.accountCode;
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedBankExtDtoErrors);
    }
  }

  getAllCities(): Observable<ListDataResult<CityDto>> {
    this.cityDtos$ = this.cityService.getAll();
    return this.cityDtos$;
  }

  getAllCurrencies(): Observable<ListDataResult<CurrencyDto>> {
    this.currencyDtos$ = this.currencyService.getAll();
    return this.currencyDtos$;
  }

  getBranchsByBusinessId(): Observable<ListDataResult<BranchDto>> {
    this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.branchDtos$;
  }

  getBankExtsByBusinessId(): Observable<ListDataResult<BankExtDto>> {
    this.bankExtDtos$ = this.bankExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.bankExtDtos$;
  }

  getDistrictsByCityId(cityId: number): Observable<ListDataResult<DistrictDto>> {
    this.districtDtos$ = this.districtService.getByCityId(cityId);
    return this.districtDtos$;
  }

  navigate(routeHistory: RouteHistory) {
    if (routeHistory.previousRoute != "") {
      if (routeHistory.accountId != 0) {
        this.bankExtService.getExtByAccountId(routeHistory.accountId)
        .pipe(
          takeUntil(this.unsubscribeAll),
        ).subscribe({
          next: (response) => {
            this.selectedBankExtDto = response.data;
          }, error: (error) => {
            console.log(error);
            this.toastService.danger(error.message);
          }
        });
      }

      this.activePage = "detail";
    } else {
      this.bankExtDtos$ = this.getBankExtsByBusinessId();
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

  save(selectedBankExtDto: BankExtDto): void {
    if (selectedBankExtDto.bankId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedBankExtDto: BankExtDto): void {
    if (selectedBankExtDto) {
      this.selectedBankExtDto = selectedBankExtDto;
      this.districtDtos$ = this.getDistrictsByCityId(selectedBankExtDto.cityId);
    } else {
      this.selectedBankExtDto = this.bankExtService.emptyBankExtDto;  
    }
    this.setHeader(this.selectedBankExtDto.bankId);
    this.activePage = "detail";
  }

  selectCity(cityId: number): void {
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedBankExtDto.districtId = 0;

    this.districtDtos$ = this.getDistrictsByCityId(cityId);
  }

  setHeader(bankId: number): void {
    bankId == 0 ? this.cardHeader = "Banka Ekle" : this.cardHeader = "Bankayı Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateBankExtDto(this.selectedBankExtDto, "update");
    this.selectedBankExtDtoErrors = errors;
    if (isModelValid) {
      this.bankExtService.updateExt(this.selectedBankExtDto)
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
      console.log(this.selectedBankExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
