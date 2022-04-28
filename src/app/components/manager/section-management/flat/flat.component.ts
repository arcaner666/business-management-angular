import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { FlatExtDtoErrors } from 'src/app/models/validation-errors/flat-ext-dto-errors';
import { HouseOwnerDto } from 'src/app/models/dtos/house-owner-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { TenantDto } from 'src/app/models/dtos/tenant-dto';

import { ApartmentService } from 'src/app/services/apartment.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { FlatExtService } from 'src/app/services/flat-ext.service';
import { HouseOwnerService } from 'src/app/services/house-owner.service';
import { SectionService } from 'src/app/services/section.service';
import { TenantService } from 'src/app/services/tenant.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

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
  public selectedFlatExtDto: FlatExtDto;
  public selectedFlatExtDtoErrors: FlatExtDtoErrors;
  public tenantDtos$!: Observable<ListDataResult<TenantDto>>;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private apartmentService: ApartmentService,
    private authorizationService: AuthorizationService,
    private houseOwnerService: HouseOwnerService,
    private flatExtService: FlatExtService,
    private modalService: NgbModal,
    private sectionService: SectionService,
    private tenantService: TenantService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("FlatComponent constructor çalıştı.");

    this.selectedFlatExtDto = this.flatExtService.emptyFlatExtDto;
    this.selectedFlatExtDtoErrors = this.flatExtService.emptyFlatExtDtoErrors;

    this.getFlatExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getHouseOwnersByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getSectionsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getTenantsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    this.selectedFlatExtDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.selectedFlatExtDto.branchId = this.authorizationService.authorizationDto.branchId;

    let [isModelValid, errors] = this.validationService.validateFlatExtDto(this.selectedFlatExtDto, "add");
    this.selectedFlatExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.flatExtService.addExt(this.selectedFlatExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;

          return this.flatExtDtos$ = this.flatExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
      console.log(this.selectedFlatExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedFlatExtDto: FlatExtDto): void {
    this.flatExtService.getExtById(selectedFlatExtDto.flatId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedFlatExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.flatExtService.deleteExt(selectedFlatExtDto.flatId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.flatExtDtos$ = this.flatExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getApartmentsBySectionId(sectionId: number): void {
    this.apartmentDtos$ = this.apartmentService.getBySectionId(sectionId);
  }

  getHouseOwnersByBusinessId(businessId: number): void {
    this.houseOwnerDtos$ = this.houseOwnerService.getByBusinessId(businessId);
  }

  getSectionsByBusinessId(businessId: number): void {
    this.sectionDtos$ = this.sectionService.getByBusinessId(businessId);
  }

  getFlatExtsByBusinessId(businessId: number): void {
    this.flatExtDtos$ = this.flatExtService.getExtsByBusinessId(businessId);
  }

  getTenantsByBusinessId(businessId: number): void {
    this.tenantDtos$ = this.tenantService.getByBusinessId(businessId);
  }

  save(selectedFlatExtDto: FlatExtDto): void {
    if (selectedFlatExtDto.flatId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedFlatExtDto: FlatExtDto): void {
    this.selectedFlatExtDto = this.flatExtService.emptyFlatExtDto;
    
    if (!selectedFlatExtDto) {  
      selectedFlatExtDto = this.flatExtService.emptyFlatExtDto;    
    } 

    this.setHeader(selectedFlatExtDto.flatId);

    if (selectedFlatExtDto.flatId != 0) {
      this.flatExtService.getExtById(selectedFlatExtDto.flatId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedFlatExtDto = response.data;
          this.apartmentDtos$ = this.apartmentService.getBySectionId(response.data.sectionId);
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  selectSection(sectionId: number): void {
    // Site listesi her yenilendiğinde apartman listesi de yenilenmeli.
    this.selectedFlatExtDto.apartmentId = 0;

    this.getApartmentsBySectionId(sectionId);
  }

  setHeader(flatId: number): void {
    flatId == 0 ? this.cardHeader = "Daire Ekle" : this.cardHeader = "Daireyi Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateFlatExtDto(this.selectedFlatExtDto, "update");
    this.selectedFlatExtDtoErrors = errors;
    if (isModelValid) {
      this.flatExtService.updateExt(this.selectedFlatExtDto)
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
      console.log(this.selectedFlatExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
