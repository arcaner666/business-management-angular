import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';
import { ManagerDto } from 'src/app/models/dtos/manager-dto';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';

import { ApartmentDto } from 'src/app/models/dtos/apartment-dto';
import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SectionGroupService } from 'src/app/services/section-group.service';
import { SectionService } from 'src/app/services/section.service';
import { ToastService } from 'src/app/services/toast.service';
import { SectionDto } from 'src/app/models/dtos/section-dto';
import { ApartmentService } from 'src/app/services/apartment.service';

const EMPTY_APARTMENT_DTO: ApartmentDto = {
  apartmentId: 0,
  sectionId: 0,
  businessId: 0,
  branchId: 0,
  managerId: 0,
  apartmentName: "",
  apartmentCode: "",
  blockNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const EMPTY_APARTMENT_EXT_DTO: ApartmentExtDto = {
  apartmentId: 0,
  sectionId: 0,
  businessId: 0,
  branchId: 0,
  managerId: 0,
  apartmentName: "",
  apartmentCode: "",
  blockNumber: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  
  // Extended With Section
  sectionName: "",

  // Extended With Manager
  managerNameSurname: "",
};

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
  public selectedApartmentExtDto: ApartmentExtDto = cloneDeep(EMPTY_APARTMENT_EXT_DTO);
  public selectedApartmentDto: ApartmentDto = cloneDeep(EMPTY_APARTMENT_DTO);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  
  constructor(
    private apartmentService: ApartmentService,
    private authorizationService: AuthorizationService,
    private managerService: ManagerService,
    private modalService: NgbModal,
    private sectionService: SectionService,
    private toastService: ToastService,
  ) { 
    console.log("ApartmentComponent constructor çalıştı.");

    this.getApartmentExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getManagersByBusinessId(this.authorizationService.authorizationDto.businessId);
    this.getSectionsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(selectedApartmentExtDto: ApartmentExtDto): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    selectedApartmentExtDto.businessId = this.authorizationService.authorizationDto.businessId;
    selectedApartmentExtDto.branchId = this.authorizationService.authorizationDto.branchId;

    this.sub1 = this.apartmentService.addExt(selectedApartmentExtDto).pipe(
      concatMap((response) => {
        if(response.success) {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
        }
        this.loading = false;
        return this.apartmentExtDtos$ = this.apartmentService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  delete(selectedApartmentExtDto: SectionExtDto): void {
    this.selectedApartmentExtDto = cloneDeep(EMPTY_APARTMENT_EXT_DTO);

    this.sub2 = this.apartmentService.getById(selectedApartmentExtDto.sectionId).subscribe({
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
              this.sub3 = this.apartmentService.deleteExt(selectedApartmentExtDto.sectionId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.apartmentExtDtos$ = this.apartmentService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getManagersByBusinessId(businessId: number): void {
    this.managerDtos$ = this.managerService.getByBusinessId(businessId);
  }

  getSectionExtsByBusinessId(businessId: number): void {
    this.sectionExtDtos$ = this.sectionService.getExtsByBusinessId(businessId);
  }

  getSectionGroupsByBusinessId(businessId: number): void {
    this.sectionGroupDtos$ = this.sectionGroupService.getByBusinessId(businessId);
  }

  getSectionExtById(id: number): void {
    this.sub4 = this.sectionService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedSectionExtDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  save(selectedSectionExtDto: SectionExtDto): void {
    this.loading = true;
    if (selectedSectionExtDto.sectionId == 0) {
      this.addExt(selectedSectionExtDto);
    } else {
      this.updateExt(selectedSectionExtDto);
    }
  }

  select(selectedSectionExtDto: SectionExtDto): void {
    this.setHeader(selectedSectionExtDto.sectionId);

    this.selectedSectionExtDto = cloneDeep(EMPTY_SECTION_EXT_DTO);

    if (selectedSectionExtDto.sectionId != 0) {
      this.sub5 = this.sectionService.getExtById(selectedSectionExtDto.sectionId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedSectionExtDto = response.data;
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(sectionId: number): void {
    sectionId == 0 ? this.cardHeader = "Site Ekle" : this.cardHeader = "Siteyi Düzenle";
  }

  updateExt(selectedSectionExtDto: SectionExtDto): void {
    this.sub6 = this.sectionService.updateExt(selectedSectionExtDto).subscribe({
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
