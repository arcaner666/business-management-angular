import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BranchDto } from 'src/app/models/dtos/branch-dto';
import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { CityDto } from 'src/app/models/dtos/city-dto';
import { DistrictDto } from 'src/app/models/dtos/district-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { ToastService } from 'src/app/services/toast.service';

const EMPTY_BRANCH_EXT_DTO: BranchExtDto = {
  branchId: 0,
  businessId: 0,
  fullAddressId: 0,
  branchOrder: 0,
  branchName: "",
  branchCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With FullAddress
  cityId: 0,
  districtId: 0,
  addressTitle: "",
  postalCode: 0,
  addressText: "",
};

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public branchDtos$!: Observable<ListDataResult<BranchDto>>;
  public cardHeader: string = "";
  public cityDtos$!: Observable<ListDataResult<CityDto>>;
  public districtDtos$!: Observable<ListDataResult<DistrictDto>>;
  public loading: boolean = false;
  public selectedBranchExtDto: BranchExtDto = cloneDeep(EMPTY_BRANCH_EXT_DTO);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  public sub7: Subscription = new Subscription();
  
  constructor(
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private cityService: CityService,
    private districtService: DistrictService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) { 
    console.log("BranchComponent constructor çalıştı.");

    this.getAllCities();
    this.getBranchesByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addBranch(selectedBranchExtDto: BranchExtDto): void {
    // Sunucuya gönderilecek modelin businessId kısmını günceller.
    selectedBranchExtDto.businessId = this.authorizationService.authorizationDto.businessId;

    this.sub1 = this.branchService.addExt(selectedBranchExtDto).pipe(
      concatMap((response) => {
        if(response.success) {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
        }
        this.loading = false;
        return this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
      }
    )).subscribe({
      error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);

        // Sunucudan yapılan isteğe cevap geldiğini child component'e bildirir.
        this.loading = false;
      }
    });
  }

  cancelBranch(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  deleteBranch(selectedBranchDto: BranchDto): void {
    this.selectedBranchExtDto = cloneDeep(EMPTY_BRANCH_EXT_DTO);

    this.sub2 = this.branchService.getExtById(selectedBranchDto.branchId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedBranchExtDto = response.data;
          this.districtDtos$ = this.districtService.getByCityId(response.data.cityId);

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.branchService.delete(selectedBranchDto.branchId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.branchDtos$ = this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
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

        // Sunucudan yapılan isteğe cevap geldiğini child component'e bildirir.
        this.loading = false;
      }, error: (error) => {
        console.log(error);
        this.toastService.danger(error.message);

        // Sunucudan yapılan isteğe cevap geldiğini child component'e bildirir.
        this.loading = false;
      }
    });
  }

  generateBranchCode(): void {
    this.sub4 = this.branchService.generateBranchCode(this.authorizationService.authorizationDto.businessId).subscribe({
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

  getBranchesByBusinessId(businessId: number): void {
    this.branchDtos$ = this.branchService.getByBusinessId(businessId);
  }

  getBranchExtById(id: number): void {
    this.sub5 = this.branchService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedBranchExtDto = response.data;
          this.getDistrictsByCityId(response.data.cityId);
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  getDistrictsByCityId(cityId: number): void {
    this.districtDtos$ = this.districtService.getByCityId(cityId);
  }

  saveBranch(selectedBranchExtDto: BranchExtDto): void {
    this.loading = true;
    if (selectedBranchExtDto.branchId == 0) {
      this.addBranch(selectedBranchExtDto);
    } else {
      this.updateBranch(selectedBranchExtDto);
    }
  }

  selectBranch(selectedBranchDto: BranchDto): void {
    this.setHeader(selectedBranchDto.branchId);

    this.selectedBranchExtDto = cloneDeep(EMPTY_BRANCH_EXT_DTO);

    if (selectedBranchDto.branchId != 0) {
      this.sub6 = this.branchService.getExtById(selectedBranchDto.branchId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedBranchExtDto = response.data;
            this.districtDtos$ = this.districtService.getByCityId(response.data.cityId);
            this.toastService.success(response.message);
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(branchId: number): void {
    branchId == 0 ? this.cardHeader = "Şube Ekle" : this.cardHeader = "Şubeyi Düzenle";
  }

  updateBranch(selectedBranchExtDto: BranchExtDto): void {
    this.sub7 = this.branchService.updateExt(selectedBranchExtDto).subscribe({
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
    if (this.sub7) {
      this.sub7.unsubscribe();
    }
  }
}
