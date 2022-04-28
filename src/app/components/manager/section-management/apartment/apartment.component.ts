import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { ApartmentExtDtoErrors } from 'src/app/models/validation-errors/apartment-ext-dto-errors';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionDto } from 'src/app/models/dtos/section-dto';

import { ApartmentExtService } from 'src/app/services/apartment-ext.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SectionService } from 'src/app/services/section.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public apartmentExtDtos$!: Observable<ListDataResult<ApartmentExtDto>>;
  public cardHeader: string = "";
  public loading: boolean = false;
  public managerDtos$!: Observable<ListDataResult<ManagerDto>>;
  public sectionDtos$!: Observable<ListDataResult<SectionDto>>;
  public selectedApartmentExtDto: ApartmentExtDto;
  public selectedApartmentExtDtoErrors: ApartmentExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private apartmentExtService: ApartmentExtService,
    private authorizationService: AuthorizationService,
    private managerService: ManagerService,
    private modalService: NgbModal,
    private sectionService: SectionService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("ApartmentComponent constructor çalıştı.");

    this.selectedApartmentExtDto = this.apartmentExtService.emptyApartmentExtDto;
    this.selectedApartmentExtDtoErrors = this.apartmentExtService.emptyApartmentExtDtoErrors;

    this.getApartmentExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getManagersByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getSectionsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    this.selectedApartmentExtDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.selectedApartmentExtDto.branchId = this.authorizationService.authorizationDto.branchId;

    let [isModelValid, errors] = this.validationService.validateApartmentExtDto(this.selectedApartmentExtDto, "add");
    this.selectedApartmentExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.apartmentExtService.addExt(this.selectedApartmentExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;

          return this.apartmentExtDtos$ = this.apartmentExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
      console.log(this.selectedApartmentExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedApartmentExtDto: ApartmentExtDto): void {
    this.apartmentExtService.getExtById(selectedApartmentExtDto.apartmentId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedApartmentExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.apartmentExtService.deleteExt(selectedApartmentExtDto.apartmentId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.apartmentExtDtos$ = this.apartmentExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getApartmentExtsByBusinessId(businessId: number): void {
    this.apartmentExtDtos$ = this.apartmentExtService.getExtsByBusinessId(businessId);
  }

  getManagersByBusinessId(businessId: number): void {
    this.managerDtos$ = this.managerService.getByBusinessId(businessId);
  }

  getSectionsByBusinessId(businessId: number): void {
    this.sectionDtos$ = this.sectionService.getByBusinessId(businessId);
  }

  save(selectedApartmentExtDto: ApartmentExtDto): void {
    if (selectedApartmentExtDto.apartmentId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedApartmentExtDto: ApartmentExtDto): void {
    this.selectedApartmentExtDto = this.apartmentExtService.emptyApartmentExtDto;
    
    if (!selectedApartmentExtDto) {  
      selectedApartmentExtDto = this.apartmentExtService.emptyApartmentExtDto;    
    } 

    this.setHeader(selectedApartmentExtDto.apartmentId);

    if (selectedApartmentExtDto.apartmentId != 0) {
      this.apartmentExtService.getExtById(selectedApartmentExtDto.apartmentId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedApartmentExtDto = response.data;
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(apartmentId: number): void {
    apartmentId == 0 ? this.cardHeader = "Apartman Ekle" : this.cardHeader = "Apartmanı Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateApartmentExtDto(this.selectedApartmentExtDto, "update");
    this.selectedApartmentExtDtoErrors = errors;
    if (isModelValid) {
      this.apartmentExtService.updateExt(this.selectedApartmentExtDto)
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
      console.log(this.selectedApartmentExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
