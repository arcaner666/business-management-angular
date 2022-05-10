import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';
import { TenantExtDtoErrors } from 'src/app/models/validation-errors/tenant-ext-dto-errors';
import { RouteHistory } from 'src/app/models/various/route-history';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { TenantExtService } from 'src/app/services/tenant-ext.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

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
  public selectedTenantExtDto: TenantExtDto;
  public selectedTenantExtDtoErrors: TenantExtDtoErrors;
  public tenantExtDtos$!: Observable<ListDataResult<TenantExtDto>>;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private accountExtService: AccountExtService,
    private accountGroupService: AccountGroupService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private modalService: NgbModal,
    private navigationService: NavigationService,
    private router: Router,
    private tenantExtService: TenantExtService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("TenantComponent constructor çalıştı.");

    this.selectedTenantExtDto = this.tenantExtService.emptyTenantExtDto;
    this.selectedTenantExtDtoErrors = this.tenantExtService.emptyTenantExtDtoErrors;

    this.getAllAccountGroups();
    this.branchDtos$ = this.getBranchsByBusinessId();
    
    this.navigate(this.navigationService.routeHistory);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedTenantExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateTenantExtDto(this.selectedTenantExtDto, "add");
    this.selectedTenantExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.tenantExtService.addExt(this.selectedTenantExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.navigateOnCompletion(this.navigationService.routeHistory);
          window.scroll(0,0);
          this.loading = false;
  
          return this.getTenantExtsByBusinessId();
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
    this.navigateOnCompletion(this.navigationService.routeHistory);
    window.scroll(0,0);
  }

  delete(selectedTenantExtDto: TenantExtDto): void {
    this.tenantExtService.getExtById(selectedTenantExtDto.tenantId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedTenantExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.tenantExtService.deleteExt(selectedTenantExtDto.tenantId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getTenantExtsByBusinessId();
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
    let [isModelValid, errors] = this.validationService.validateTenantExtDto(this.selectedTenantExtDto, "code");
    this.selectedTenantExtDtoErrors = errors;
    if (isModelValid) {      
      this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.selectedTenantExtDto.branchId, 
        "120")
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedTenantExtDto.accountOrder = response.data.accountOrder;
          this.selectedTenantExtDto.accountCode = response.data.accountCode;
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
    this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.branchDtos$;
  }

  getTenantExtsByBusinessId(): Observable<ListDataResult<TenantExtDto>> {
    this.tenantExtDtos$ = this.tenantExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.tenantExtDtos$;
  }

  navigate(routeHistory: RouteHistory) {
    if (routeHistory.previousRoute != "") {
      if (routeHistory.accountId != 0) {
        this.tenantExtService.getExtByAccountId(routeHistory.accountId)
        .pipe(
          takeUntil(this.unsubscribeAll),
        ).subscribe({
          next: (response) => {
            this.selectedTenantExtDto = response.data;
          }, error: (error) => {
            console.log(error);
            this.toastService.danger(error.message);
          }
        });
      }

      this.activePage = "detail";
    } else {
      this.tenantExtDtos$ = this.getTenantExtsByBusinessId();
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

  save(selectedTenantExtDto: TenantExtDto): void {
    if (selectedTenantExtDto.tenantId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedTenantExtDto: TenantExtDto): void {
    this.selectedTenantExtDto = this.tenantExtService.emptyTenantExtDto;
    
    if (!selectedTenantExtDto) {  
      selectedTenantExtDto = this.tenantExtService.emptyTenantExtDto;    
    } 

    this.setHeader(selectedTenantExtDto.tenantId);

    if (selectedTenantExtDto.tenantId != 0) {
      this.tenantExtService.getExtById(selectedTenantExtDto.tenantId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedTenantExtDto = response.data;
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
    let [isModelValid, errors] = this.validationService.validateTenantExtDto(this.selectedTenantExtDto, "update");
    this.selectedTenantExtDtoErrors = errors;
    if (isModelValid) {
      this.tenantExtService.updateExt(this.selectedTenantExtDto)
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
      console.log(this.selectedTenantExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
