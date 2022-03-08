import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { cloneDeep } from 'lodash';

import { Subscription, Observable } from 'rxjs';

import { BranchDto } from 'src/app/models/dtos/branchDto';
import { BranchExtDto } from 'src/app/models/dtos/branchExtDto';
import { ListDataResult } from 'src/app/models/results/listDataResult';
import { Result } from 'src/app/models/results/result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';

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
    private router: Router,
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
    // this.selectedBranchExtDto = cloneDeep(selectedBranchExtDto);

    // Swal.fire({
    //   title: "Dikkat!",
    //   text: `"${this.selectedBranchExtDto.branchName}" adlı şube silinecektir. Onaylıyor musunuz?`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   background: `${this.coreConfig.layout.skin == "default" ? this.colorPalette.solid.body : this.colorPalette.solid.dark}`,
    //   confirmButtonText: "Sil",
    //   cancelButtonText: "İptal",
    //   customClass: {
    //     confirmButton: "btn btn-danger",
    //     cancelButton: "btn btn-primary",
    //     content: `${this.coreConfig.layout.skin == "default" ? "text-black" : "text-white"}`,
    //   }
    // }).then((response) => {
    //   // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
    //   // Modal onaylanırsa true, reddedilirse false döner.
    //   if (response.value) {
    //     // Sunucuya seçili şubeyi silme isteği gönderilir.
    //     this.sub2 = this.branchService.deleteExt(this.selectedBranchExtDto).pipe(
    //       concatMap(() => {
    //         // Kayıt başarıyla eklendiğinde toastr ile bildirir.
    //         this._toastrService.success(`Kayıt silindi.`, 'İşlem Başarılı!', {
    //           closeButton: true,
    //           easeTime: 300,
    //           positionClass: 'toast-top-right',
    //           progressBar: true,
    //           timeOut: 3000,
    //           toastClass: 'toast ngx-toastr',
    //         });
            
    //         // Sunucudan şubeleri getirir ve modellere doldurur.
    //         return this.branchService.getExtsByBusinessId(this.authorizationService.authorizationDto.businessId);
    //       })
    //       ).subscribe((response) => {
    //         if (response.success) {
    //           this.branchExtDtos = response.data;
    //         }
    //       }, error => {
    //         console.log(error);
    //         // İşletmeye ait bütün şubeler silindiğinde hiç şube kalmadıysa sunucudan ErrorResult 
    //         // döndüğü için response.data şeklinde bir uzantı da olmuyor. Bu sebeple alttaki gibi boş dizi atıyoruz.
    //         if (error.message == "BranchesNotFound") {
    //           this.branchExtDtos = [];
    //         }
    //         // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
    //         this.result.success = error.success;
    //         this.result.message = error.message;
    //       });
    //   }
    // });

    // this.toggleModal();
  }

  // Modal'ı tetikler.
  toggleModal() {
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