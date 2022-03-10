import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Subscription, Observable, concatMap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BranchDto } from 'src/app/models/dtos/branchDto';
import { BranchExtDto } from 'src/app/models/dtos/branchExtDto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
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
  selector: 'app-branch2',
  templateUrl: './branch2.component.html',
  styleUrls: ['./branch2.component.scss']
})
export class Branch2Component implements OnInit {

  @ViewChild('deleteModal') deleteModal: ElementRef | undefined;
  
  public branchDtos$: Observable<ListDataResult<BranchDto>> | undefined;
  public processType: number = 0;
  public selectedBranchExtDto: BranchExtDto = cloneDeep(EMPTY_BRANCH_EXT_DTO)
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  
  constructor(
    private authorizationService: AuthorizationService,
    private toastService: ToastService,
    private modalService: NgbModal,

    public branchService: BranchService,
  ) { 
    console.log("BranchComponent constructor çalıştı.");

    this.getBranchesByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  selectBranch(value: any) {
    this.processType = 1;
    console.log(value);
  }

  saveBranch() {

  }

  addBranch() {
    this.sub1 = this.branchService.addExt(this.selectedBranchExtDto).subscribe({
      next: (response) => {
        if(response.success) {
          // Kayıt başarıyla eklendiğinde toast ile bildirir.
          this.toastService.success(response.message);

          // Ekleme işlemi tamamlandığında listeleme kısmına geri döner.
          this.processType = 0;
        }
      }, error: (error) => {
        console.log(error);

        // Kayıt eklenemediğinde toast ile bildirir.
        this.toastService.danger(error.message);
      }
    });
  }

  openDeleteModal() {
    // Silme onay penceresini açar.
    this.modalService.open(this.deleteModal, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    }).result.then((response) => {
      // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
      if (response == "ok") {
        // Sunucuya seçili şubeyi silme isteği gönderilir.
        this.sub2 = this.branchService.delete(this.selectedBranchExtDto.branchId).pipe(
          concatMap((response) => {
            // Kayıt başarıyla silindiğinde toast ile bildirir.
            this.toastService.success(response.message);
            
            // Sunucudan şubeleri getirir ve modellere doldurur.
            return this.branchService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
          }
        )).subscribe({
          next: (response) => {
            if (response.success) {
              //this.branchDtos = response.data;
            }
          }, error: (error) => {
            console.log(error);

            // İşletmeye ait bütün şubeler silindiğinde hiç şube kalmadıysa sunucudan ErrorResult 
            // döndüğü için response.data şeklinde bir uzantı da olmuyor. Bu sebeple alttaki gibi boş dizi atıyoruz.
            if (error.message == "BranchesNotFound") {
              //this.branchDtos = [];
            }

            // Kayıt silinemezse sunucudan gelen hata mesajını toast ile bildirir.
            this.toastService.danger(error.message);
          }
        });
      }
    }).catch(() => {});
  }

  getBranchesByBusinessId(businessId: number) {
    this.branchDtos$ = this.branchService.getByBusinessId(businessId);
  }

  ngOnInit(): void {
  }

}
