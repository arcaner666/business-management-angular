import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY, pipe } from 'rxjs';
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
  public selectedHouseOwnerExtDto: HouseOwnerExtDto;
  public selectedHouseOwnerExtDtoErrors: HouseOwnerExtDtoErrors;

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
    console.log("HouseOwnerComponent constructor çalıştı.");

    this.selectedHouseOwnerExtDto = this.houseOwnerExtService.emptyHouseOwnerExtDto;
    this.selectedHouseOwnerExtDtoErrors = this.houseOwnerExtService.emptyHouseOwnerExtDtoErrors;

    this.getAllAccountGroups();
    this.branchDtos$ = this.getBranchsByBusinessId();
    this.houseOwnerExtDtos$ = this.getHouseOwnerExtsByBusinessId();
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedHouseOwnerExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateHouseOwnerExtDto(this.selectedHouseOwnerExtDto, "add");
    this.selectedHouseOwnerExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.houseOwnerExtService.addExt(this.selectedHouseOwnerExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;

          return this.getHouseOwnerExtsByBusinessId();
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
    this.houseOwnerExtService.getExtById(selectedHouseOwnerExtDto.houseOwnerId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedHouseOwnerExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.houseOwnerExtService.deleteExt(selectedHouseOwnerExtDto.houseOwnerId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getHouseOwnerExtsByBusinessId();
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

  generateAccountCode() {
    let [isModelValid, errors] = this.validationService.validateHouseOwnerExtDto(this.selectedHouseOwnerExtDto, "code");
    this.selectedHouseOwnerExtDtoErrors = errors;
    if (isModelValid) {      
      this.accountExtService.generateAccountCode(
        this.authorizationService.authorizationDto.businessId, 
        this.selectedHouseOwnerExtDto.branchId, 
        "120")
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedHouseOwnerExtDto.accountOrder = response.data.accountOrder;
          this.selectedHouseOwnerExtDto.accountCode = response.data.accountCode;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    } else {
      console.log("Form geçersiz.");
      console.log(this.selectedHouseOwnerExtDtoErrors);
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

  getHouseOwnerExtsByBusinessId(): Observable<ListDataResult<HouseOwnerExtDto>> {
    this.houseOwnerExtDtos$ = this.houseOwnerExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    return this.houseOwnerExtDtos$;
  }

  save(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    if (selectedHouseOwnerExtDto.houseOwnerId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.selectedHouseOwnerExtDto = this.houseOwnerExtService.emptyHouseOwnerExtDto;
    
    if (!selectedHouseOwnerExtDto) {  
      selectedHouseOwnerExtDto = this.houseOwnerExtService.emptyHouseOwnerExtDto;    
    } 

    this.setHeader(selectedHouseOwnerExtDto.houseOwnerId);

    if (selectedHouseOwnerExtDto.houseOwnerId != 0) {
      this.houseOwnerExtService.getExtById(selectedHouseOwnerExtDto.houseOwnerId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedHouseOwnerExtDto = response.data;
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
    let [isModelValid, errors] = this.validationService.validateHouseOwnerExtDto(this.selectedHouseOwnerExtDto, "update");
    this.selectedHouseOwnerExtDtoErrors = errors;
    if (isModelValid) {
      this.houseOwnerExtService.updateExt(this.selectedHouseOwnerExtDto)
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
      console.log(this.selectedHouseOwnerExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
