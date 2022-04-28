import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { BranchExtDtoErrors } from 'src/app/models/validation-errors/branch-ext-dto-errors';
import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { BranchExtService } from 'src/app/services/branch-ext.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public branchExtDtos$!: Observable<ListDataResult<BranchExtDto>>;
  public cardHeader: string = "";
  public cityDtos$!: Observable<ListDataResult<CityDto>>;
  public districtDtos$!: Observable<ListDataResult<DistrictDto>>;
  public loading: boolean = false;
  public selectedBranchExtDto: BranchExtDto;
  public selectedBranchExtDtoErrors: BranchExtDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private authorizationService: AuthorizationService,
    private branchExtService: BranchExtService,
    private branchService: BranchService,
    private cityService: CityService,
    private districtService: DistrictService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("BranchComponent constructor çalıştı.");

    this.selectedBranchExtDto = this.branchExtService.emptyBranchExtDto;
    this.selectedBranchExtDtoErrors = this.branchExtService.emptyBranchExtDtoErrors;

    this.getAllCities();
    this.getBranchExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addExt(): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    this.selectedBranchExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    let [isModelValid, errors] = this.validationService.validateBranchExtDto(this.selectedBranchExtDto, "add");
    this.selectedBranchExtDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;

      this.branchExtService.addExt(this.selectedBranchExtDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;

          return this.branchExtDtos$ = this.branchExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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
      console.log(this.selectedBranchExtDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedBranchExtDto: BranchExtDto): void {
    this.branchExtService.getExtById(selectedBranchExtDto.branchId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedBranchExtDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.branchExtService.deleteExt(selectedBranchExtDto.branchId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.branchExtDtos$ = this.branchExtService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  generateBranchCode(): void {
    this.branchService.generateBranchCode(this.authorizationService.authorizationDto.businessId)
    .pipe(
      takeUntil(this.unsubscribeAll),
    ).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedBranchExtDto.branchOrder = response.data.branchOrder;
          this.selectedBranchExtDto.branchCode = response.data.branchCode;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }
  
  getAllCities(): void {
    this.cityDtos$ = this.cityService.getAll();
  }

  getBranchExtsByBusinessId(businessId: number): void {
    this.branchExtDtos$ = this.branchExtService.getExtsByBusinessId(businessId);
  }

  getDistrictsByCityId(cityId: number): void {
    this.districtDtos$ = this.districtService.getByCityId(cityId);
  }

  save(selectedBranchExtDto: BranchExtDto): void {
    if (selectedBranchExtDto.branchId == 0) {
      this.addExt();
    } else {
      this.updateExt();
    }
  }

  select(selectedBranchExtDto: BranchExtDto): void {
    this.selectedBranchExtDto = this.branchExtService.emptyBranchExtDto;

    if (!selectedBranchExtDto) {  
      selectedBranchExtDto = this.branchExtService.emptyBranchExtDto;    
    }

    this.setHeader(selectedBranchExtDto.branchId);

    if (selectedBranchExtDto.branchId != 0) {
      this.branchExtService.getExtById(selectedBranchExtDto.branchId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedBranchExtDto = response.data;
          this.districtDtos$ = this.districtService.getByCityId(response.data.cityId);
          this.toastService.success(response.message);
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  selectCity(cityId: number): void {
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedBranchExtDto.districtId = 0;

    this.getDistrictsByCityId(cityId);
  }

  setHeader(branchId: number): void {
    branchId == 0 ? this.cardHeader = "Şube Ekle" : this.cardHeader = "Şubeyi Düzenle";
  }

  updateExt(): void {
    let [isModelValid, errors] = this.validationService.validateBranchExtDto(this.selectedBranchExtDto, "update");
    this.selectedBranchExtDtoErrors = errors;
    if (isModelValid) {
      this.branchExtService.updateExt(this.selectedBranchExtDto)
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
      console.log(this.selectedBranchExtDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
