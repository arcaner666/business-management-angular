import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { HouseOwnerDto } from 'src/app/models/dtos/house-owner-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { TenantDto } from 'src/app/models/dtos/tenant-dto';

import { ApartmentService } from 'src/app/services/apartment.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { FlatService } from 'src/app/services/flat.service';
import { HouseOwnerService } from 'src/app/services/house-owner.service';
import { SectionService } from 'src/app/services/section.service';
import { TenantService } from 'src/app/services/tenant.service';
import { ToastService } from 'src/app/services/toast.service';

const EMPTY_FLAT_EXT_DTO: FlatExtDto = {
  flatId: 0,
  sectionId: 0,
  apartmentId: 0,
  businessId: 0,
  branchId: 0,
  houseOwnerId: undefined,
  tenantId: undefined,
  flatCode: "",
  doorNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Section
  sectionName: "",

  // Extended With Apartment
  apartmentName: "",

  // Extended With HouseOwner
  houseOwnerNameSurname: "",

  // Extended With Tenant
  tenantNameSurname: "",
};

@Component({
  selector: 'app-flat',
  templateUrl: './flat.component.html',
  styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public apartmentDtos$!: Observable<ListDataResult<ApartmentDto>>;
  public cardHeader: string = "";
  public houseOwnerDtos$!: Observable<ListDataResult<HouseOwnerDto>>;
  public flatExtDtos$!: Observable<ListDataResult<FlatExtDto>>;
  public loading: boolean = false;
  public sectionDtos$!: Observable<ListDataResult<SectionDto>>;
  public selectedFlatExtDto: FlatExtDto = cloneDeep(EMPTY_FLAT_EXT_DTO);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  public tenantDtos$!: Observable<ListDataResult<TenantDto>>;
  
  constructor(
    private apartmentService: ApartmentService,
    private authorizationService: AuthorizationService,
    private houseOwnerService: HouseOwnerService,
    private flatService: FlatService,
    private modalService: NgbModal,
    private sectionService: SectionService,
    private tenantService: TenantService,
    private toastService: ToastService,
  ) { 
    console.log("FlatComponent constructor çalıştı.");

    this.getFlatExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getHouseOwnersByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getSectionsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getTenantsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(selectedFlatExtDto: FlatExtDto): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    selectedFlatExtDto.businessId = this.authorizationService.authorizationDto.businessId;
    selectedFlatExtDto.branchId = this.authorizationService.authorizationDto.branchId;

    this.sub1 = this.flatService.addExt(selectedFlatExtDto).pipe(
      concatMap((response) => {
        if(response.success) {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
        }
        this.loading = false;
        return this.flatExtDtos$ = this.flatService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
      }
    )).subscribe({
      error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedFlatExtDto: FlatExtDto): void {
    this.selectedFlatExtDto = cloneDeep(EMPTY_FLAT_EXT_DTO);

    this.sub2 = this.flatService.getExtById(selectedFlatExtDto.flatId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedFlatExtDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.flatService.deleteExt(selectedFlatExtDto.flatId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.flatExtDtos$ = this.flatService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getApartmentsBySectionId(sectionId: number): void {
    this.apartmentDtos$ = this.apartmentService.getBySectionId(sectionId);
  }

  getHouseOwnersByBusinessId(businessId: number): void {
    this.houseOwnerDtos$ = this.houseOwnerService.getByBusinessId(businessId);
  }

  getSectionsByBusinessId(businessId: number): void {
    this.sectionDtos$ = this.sectionService.getByBusinessId(businessId);
  }

  getFlatExtById(id: number): void {
    this.sub4 = this.flatService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedFlatExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getFlatExtsByBusinessId(businessId: number): void {
    this.flatExtDtos$ = this.flatService.getExtsByBusinessId(businessId);
  }

  getTenantsByBusinessId(businessId: number): void {
    this.tenantDtos$ = this.tenantService.getByBusinessId(businessId);
  }

  save(selectedFlatExtDto: FlatExtDto): void {
    this.loading = true;
    if (selectedFlatExtDto.flatId == 0) {
      this.addExt(selectedFlatExtDto);
    } else {
      this.updateExt(selectedFlatExtDto);
    }
  }

  select(selectedFlatExtDto: FlatExtDto): void {
    this.setHeader(selectedFlatExtDto.flatId);

    this.selectedFlatExtDto = cloneDeep(EMPTY_FLAT_EXT_DTO);

    if (selectedFlatExtDto.flatId != 0) {
      this.sub5 = this.flatService.getExtById(selectedFlatExtDto.flatId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedFlatExtDto = response.data;
            this.apartmentDtos$ = this.apartmentService.getBySectionId(response.data.sectionId);
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(flatId: number): void {
    flatId == 0 ? this.cardHeader = "Daire Ekle" : this.cardHeader = "Daireyi Düzenle";
  }

  updateExt(selectedFlatExtDto: FlatExtDto): void {
    this.sub6 = this.flatService.updateExt(selectedFlatExtDto).subscribe({
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
  }
}
