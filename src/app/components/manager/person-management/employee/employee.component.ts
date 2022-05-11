import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY, from, take } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { EmployeeExtDto } from 'src/app/models/dtos/employee-ext-dto';
import { EmployeeExtDtoErrors } from 'src/app/models/validation-errors/employee-ext-dto-errors';
import { EmployeeTypeDto } from 'src/app/models/dtos/employee-type-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { RouteHistory } from 'src/app/models/various/route-history';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { EmployeeExtService } from 'src/app/services/employee-ext.service';
import { EmployeeTypeService } from 'src/app/services/employee-type.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public accountGroupDtos: AccountGroupDto[] = [];
  public activePage: string = "list";
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public cardHeader: string = "";
  public employeeExtDtos$!: Observable<ListDataResult<EmployeeExtDto>>;
  public employeeTypeDtos$!: Observable<ListDataResult<EmployeeTypeDto>>;
  public loading: boolean = false;
  public selectedEmployeeExtDto: EmployeeExtDto;
  public selectedEmployeeExtDtoErrors: EmployeeExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private accountExtService: AccountExtService,
    private accountGroupService: AccountGroupService,
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private employeeExtService: EmployeeExtService,
    private employeeTypeService: EmployeeTypeService,
    private modalService: NgbModal,
    private navigationService: NavigationService,
    private router: Router,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("EmployeeComponent constructor çalıştı.");

    this.selectedEmployeeExtDto = this.employeeExtService.emptyEmployeeExtDto;
    this.selectedEmployeeExtDtoErrors = this.employeeExtService.emptyEmployeeExtDtoErrors;

    this.getAllAccountGroups();
    this.branchDtos$ = this.getBranchsByBusinessId();
    this.employeeTypeDtos$ = this.getAllEmployeeTypes();
    
    this.navigate(this.navigationService.routeHistory);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedEmployeeExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateEmployeeExtDto(this.selectedEmployeeExtDto, "add");
    this.selectedEmployeeExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.employeeExtService.addExt(this.selectedEmployeeExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.navigateOnCompletion(this.navigationService.routeHistory);
          window.scroll(0,0);
          this.loading = false;
  
          return this.getEmployeeExtsByBusinessId();
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
      console.log(this.selectedEmployeeExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedEmployeeExtDto: EmployeeExtDto): void {
    this.selectedEmployeeExtDto = selectedEmployeeExtDto;
    from(this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result)
    .pipe(
      take(1),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.employeeExtService.deleteExt(selectedEmployeeExtDto.employeeId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getEmployeeExtsByBusinessId();
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
    let [isModelValid, errors] = this.validationService.validateEmployeeExtDto(this.selectedEmployeeExtDto, "code");
    this.selectedEmployeeExtDtoErrors = errors;
    if (isModelValid) {
      this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.selectedEmployeeExtDto.branchId, 
        "335")
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedEmployeeExtDto.accountOrder = response.data.accountOrder;
          this.selectedEmployeeExtDto.accountCode = response.data.accountCode;
        }, error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedEmployeeExtDtoErrors);
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

  getAllEmployeeTypes(): Observable<ListDataResult<EmployeeTypeDto>> {
    this.employeeTypeDtos$ = this.employeeTypeService.getAll();
    return this.employeeTypeDtos$;
  }

  getBranchsByBusinessId(): Observable<ListDataResult<BranchDto>> {
    this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.branchDtos$;
  }

  getEmployeeExtsByBusinessId(): Observable<ListDataResult<EmployeeExtDto>> {
    this.employeeExtDtos$ = this.employeeExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.employeeExtDtos$;
  }

  navigate(routeHistory: RouteHistory) {
    if (routeHistory.previousRoute != "") {
      if (routeHistory.accountId != 0) {
        this.employeeExtService.getExtByAccountId(routeHistory.accountId)
        .pipe(
          takeUntil(this.unsubscribeAll),
        ).subscribe({
          next: (response) => {
            this.selectedEmployeeExtDto = response.data;
          }, error: (error) => {
            console.log(error);
            this.toastService.danger(error.message);
          }
        });
      }

      this.activePage = "detail";
    } else {
      this.employeeExtDtos$ = this.getEmployeeExtsByBusinessId();
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

  save(selectedEmployeeExtDto: EmployeeExtDto): void {
    if (selectedEmployeeExtDto.employeeId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedEmployeeExtDto: EmployeeExtDto): void {
    if (selectedEmployeeExtDto) {
      this.selectedEmployeeExtDto = selectedEmployeeExtDto;
    } else {
      this.selectedEmployeeExtDto = this.employeeExtService.emptyEmployeeExtDto;  
    }
    this.setHeader(this.selectedEmployeeExtDto.employeeId);
    this.activePage = "detail";
  }

  setHeader(employeeId: number): void {
    employeeId == 0 ? this.cardHeader = "Personel Ekle" : this.cardHeader = "Personeli Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateEmployeeExtDto(this.selectedEmployeeExtDto, "update");
    this.selectedEmployeeExtDtoErrors = errors;
    if (isModelValid) {
      console.log(this.selectedEmployeeExtDto);
      this.employeeExtService.updateExt(this.selectedEmployeeExtDto)
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
      console.log(this.selectedEmployeeExtDto);
      console.log(this.selectedEmployeeExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
