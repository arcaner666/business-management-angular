import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
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

import { AccountService } from 'src/app/services/account-ext.service';
import { AccountGroupService } from 'src/app/services/account-group.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';
import { HouseOwnerExtDtoErrors } from 'src/app/models/validation-errors/house-owner-ext-dto-errors';
import { HouseOwnerService } from 'src/app/services/house-owner.service';

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
};

@Component({
  selector: 'app-house-owner',
  templateUrl: './house-owner.component.html',
  styleUrls: ['./house-owner.component.scss']
})
export class HouseOwnerComponent implements OnInit {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public houseOwnerExtDtos$!: Observable<ListDataResult<HouseOwnerExtDto>>;
  public activePage: string = "list";
  public cardHeader: string = "";
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
    private accountService: AccountService,
    private authorizationService: AuthorizationService,
    private houseOwnerService: HouseOwnerService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("HouseOwnerComponent constructor çalıştı.");

    this.getHouseOwnerExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.selectedHouseOwnerExtDto = cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO);

    this.sub2 = this.houseOwnerService.getExtById(selectedHouseOwnerExtDto.accountId).subscribe({
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
              this.sub3 = this.houseOwnerService.deleteExt(selectedHouseOwnerExtDto.accountId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);

                  return this.houseOwnerExtDtos$ = this.houseOwnerService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getHouseOwnerExtById(id: number): void {
    this.sub5 = this.houseOwnerService.getExtById(id).subscribe({
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
    this.houseOwnerExtDtos$ = this.houseOwnerService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
  }

  save(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.updateExt();
  }

  select(selectedHouseOwnerExtDto: HouseOwnerExtDto): void {
    this.setHeader(selectedHouseOwnerExtDto.accountId);

    this.selectedHouseOwnerExtDto = cloneDeep(EMPTY_HOUSE_OWNER_EXT_DTO);

    if (selectedHouseOwnerExtDto.accountId != 0) {
      this.sub7 = this.houseOwnerService.getExtById(selectedHouseOwnerExtDto.accountId).subscribe({
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

  setHeader(accountId: number): void {
    this.cardHeader = "Mülk Sahibini Düzenle";
  }

  updateExt(): void {
    let isModelValid = this.validateForUpdate();

    if (isModelValid) {
      this.sub8 = this.houseOwnerService.updateExt(this.selectedHouseOwnerExtDto).subscribe({
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

  validateForUpdate(): boolean {
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
    if (!this.validationService.string(this.selectedHouseOwnerExtDto.gender)) {
      this.selectedHouseOwnerExtDtoErrors.gender = "Lütfen cinsiyet seçiniz.";
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
