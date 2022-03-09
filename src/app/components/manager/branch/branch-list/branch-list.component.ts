import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription, Observable, concatMap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BranchDto } from 'src/app/models/dtos/branchDto';
import { BranchExtDto } from 'src/app/models/dtos/branchExtDto';
import { ListDataResult } from 'src/app/models/results/listDataResult';
import { Result } from 'src/app/models/results/result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { ToastService } from 'src/app/services/toast.service';

const EMPTY_BRANCH_DTO: BranchDto = {
  branchId: 0,
  businessId: 0,
  fullAddressId: 0,
  branchOrder: 0,
  branchName: "",
  branchCode: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal: ElementRef | undefined;

  public branchDtos: BranchDto[] = [];
  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 10;
  public pageSize: number = 0;
  public result: Result = { success: false, message: ""};
  public selectedBranchId: number = 0;
  public selectedBranchDto: BranchDto = cloneDeep(EMPTY_BRANCH_DTO);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();

  constructor(
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private modalService: NgbModal,
    private router: Router,
    private toastService: ToastService,
  ) {
    console.log("BranchListComponent constructor çalıştı.");

    // Sunucudan şubeleri getirir ve modellere doldurur.
    this.getBranchesByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  // Şubeleri sunucudan getirir ve modellere doldurur.
  getBranchesByBusinessId(businessId: number): void {
    this.sub1 = this.branchService.getByBusinessId(businessId).subscribe({
      next: (response) => { 
        if(response.success) {
          this.branchDtos = response.data;
        }
      }, error: (error) => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.result.success = error.success;
      this.result.message = error.message;
      }
    });
  }

  // Paginator'daki değişiklikleri tabloya uygular.
  onPageChange(currentPage: number): void {
    this.pageSize = this.itemsPerPage * (currentPage - 1);
    if(currentPage == 1){
      this.elementIndex = 0;
    } else {
      this.elementIndex = (currentPage - 1) * this.itemsPerPage;
    }
  }

  // Şube ekleme sayfasına yönlendirir.
  openAddBranchPage(): void {
    this.branchService.selectedProcessType = 1;
    this.branchService.selectedBranchId = 0;
  
    this.router.navigate(["manager/branch-edit"]);
  }

  // Seçili şubeyi düzenleme sayfasına yönlendirir.
  openEditBranchPage(selectedBranchDto: BranchDto) {
    this.branchService.selectedProcessType = 2;
    this.branchService.selectedBranchId = selectedBranchDto.branchId;
  
    this.router.navigate(["manager/branch-edit"]);
  }

  // Seçili şubeyi silme onay penceresini açar.
  openDeleteBranchModal(selectedBranchDto: BranchDto) {
    this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result.then((response) => {
      // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
      // Modal onaylanırsa true, reddedilirse false döner.
      console.log(response);
      if (response == "ok") {
        // Sunucuya seçili şubeyi silme isteği gönderilir.
        this.sub2 = this.branchService.delete(selectedBranchDto.branchId).pipe(
          concatMap(() => {
            // Kayıt başarıyla silindiğinde toastr ile bildirir.
            this.toastService.success("", "Kayıt Silindi.", 5000);
            
            // Sunucudan şubeleri getirir ve modellere doldurur.
            return this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
          }
        )).subscribe({
          next: (response) => {
            if (response.success) {
              this.branchDtos = response.data;
            }
          }, error: (error) => {
            console.log(error);
            // İşletmeye ait bütün şubeler silindiğinde hiç şube kalmadıysa sunucudan ErrorResult 
            // döndüğü için response.data şeklinde bir uzantı da olmuyor. Bu sebeple alttaki gibi boş dizi atıyoruz.
            if (error.message == "BranchesNotFound") {
              this.branchDtos = [];
            }
            // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
            this.result.success = error.success;
            this.result.message = error.message;

            // Kayıt silinemezse sunucudan gelen hata mesajını toastr ile bildirir.
            this.toastService.danger("", this.result.message, 5000);
          }
        });
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
  }
}