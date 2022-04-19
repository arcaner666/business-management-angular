import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
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

    this.selectedTenantExtDto = this.tenantExtService.emptyTenantExtDto;
    this.selectedTenantExtDtoErrors = this.tenantExtService.emptyTenantExtDtoErrors;

    this.getAllAccountGroups();

    this.getBranchsByBusinessId(this.authorizationService.authorizationDto.businessId);

    this.getTenantExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedTenantExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateTenantExtDto(this.selectedTenantExtDto, "add");
    this.selectedTenantExtDtoErrors = errors;
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
                  this.tenantExtDtos$ = this.tenantExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
    let [isModelValid, errors] = this.validationService.validateTenantExtDto(this.selectedTenantExtDto, "code");
    this.selectedTenantExtDtoErrors = errors;
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
    let [isModelValid, errors] = this.validationService.validateTenantExtDto(this.selectedTenantExtDto, "update");
    this.selectedTenantExtDtoErrors = errors;
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
