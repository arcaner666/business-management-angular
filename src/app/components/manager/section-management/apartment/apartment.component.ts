import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
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
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  
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

      this.sub1 = this.apartmentExtService.addExt(this.selectedApartmentExtDto).pipe(
        concatMap((response) => {
          if(response.success) {
            this.toastService.success(response.message);
            this.activePage = "list";
            window.scroll(0,0);
          }
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
    this.sub2 = this.apartmentExtService.getExtById(selectedApartmentExtDto.apartmentId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedApartmentExtDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.apartmentExtService.deleteExt(selectedApartmentExtDto.apartmentId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.apartmentExtDtos$ = this.apartmentExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getApartmentExtsByBusinessId(businessId: number): void {
    this.apartmentExtDtos$ = this.apartmentExtService.getExtsByBusinessId(businessId);
  }

  getManagersByBusinessId(businessId: number): void {
    this.managerDtos$ = this.managerService.getByBusinessId(businessId);
  }

  getSectionsByBusinessId(businessId: number): void {
    this.sectionDtos$ = this.sectionService.getByBusinessId(businessId);
  }

  getApartmentExtById(id: number): void {
    this.sub4 = this.apartmentExtService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedApartmentExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
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
      this.sub5 = this.apartmentExtService.getExtById(selectedApartmentExtDto.apartmentId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedApartmentExtDto = response.data;
          }
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
      this.sub6 = this.apartmentExtService.updateExt(this.selectedApartmentExtDto).subscribe({
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
      console.log(this.selectedApartmentExtDtoErrors);
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
  }
}
