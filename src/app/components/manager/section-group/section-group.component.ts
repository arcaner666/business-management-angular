import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Subscription, Observable, concatMap, tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { SectionGroupService } from 'src/app/services/section-group.service';
import { ToastService } from 'src/app/services/toast.service';

const EMPTY_SECTION_GROUP_DTO: SectionGroupDto = {
  sectionGroupId: 0,
  businessId: 0,
  branchId: 0,
  sectionGroupName: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Component({
  selector: 'app-section-group',
  templateUrl: './section-group.component.html',
  styleUrls: ['./section-group.component.scss']
})
export class SectionGroupComponent implements OnInit, OnDestroy {

  @ViewChild('deleteModal') deleteModal!: ElementRef;
  
  public activePage: string = "list";
  public cardHeader: string = "";
  public loading: boolean = false;
  public sectionGroupDtos$!: Observable<ListDataResult<SectionGroupDto>>;
  public selectedSectionGroupDto: SectionGroupDto = cloneDeep(EMPTY_SECTION_GROUP_DTO);
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  
  constructor(
    private authorizationService: AuthorizationService,
    private modalService: NgbModal,
    private sectionGroupService: SectionGroupService,
    private toastService: ToastService,
  ) { 
    console.log("SectionGroupComponent constructor çalıştı.");

    this.getSectionGroupsByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  addSectionGroup(selectedSectionGroupDto: SectionGroupDto): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    selectedSectionGroupDto.businessId = this.authorizationService.authorizationDto.businessId;
    selectedSectionGroupDto.branchId = this.authorizationService.authorizationDto.branchId;

    this.sub1 = this.sectionGroupService.add(selectedSectionGroupDto).pipe(
      concatMap((response) => {
        if(response.success) {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
        }
        this.loading = false;
        return this.sectionGroupDtos$ = this.sectionGroupService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  deleteSectionGroup(selectedSectionGroupDto: SectionGroupDto): void {
    this.selectedSectionGroupDto = cloneDeep(EMPTY_SECTION_GROUP_DTO);

    this.sub2 = this.sectionGroupService.getById(selectedSectionGroupDto.sectionGroupId).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedSectionGroupDto = response.data;

          // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
          this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result.then((response) => {
            // Burada response modal'daki seçeneklere verilen yanıtı tutar. 
            if (response == "ok") {
              this.sub3 = this.sectionGroupService.delete(selectedSectionGroupDto.sectionGroupId).pipe(
                tap((response) => {
                  console.log(response);
                  this.toastService.success(response.message);
                  this.sectionGroupDtos$ = this.sectionGroupService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
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

  getSectionGroupsByBusinessId(businessId: number): void {
    this.sectionGroupDtos$ = this.sectionGroupService.getByBusinessId(businessId);
  }

  getSectionGroupById(id: number): void {
    this.sub4 = this.sectionGroupService.getById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedSectionGroupDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  save(selectedSectionGroupDto: SectionGroupDto): void {
    this.loading = true;
    if (selectedSectionGroupDto.sectionGroupId == 0) {
      this.addSectionGroup(selectedSectionGroupDto);
    } else {
      this.updateSectionGroup(selectedSectionGroupDto);
    }
  }

  selectSectionGroup(selectedSectionGroupDto: SectionGroupDto): void {
    this.setHeader(selectedSectionGroupDto.sectionGroupId);

    this.selectedSectionGroupDto = cloneDeep(EMPTY_SECTION_GROUP_DTO);

    if (selectedSectionGroupDto.sectionGroupId != 0) {
      this.sub5 = this.sectionGroupService.getById(selectedSectionGroupDto.sectionGroupId).subscribe({
        next: (response) => {
          if(response.success) {
            this.selectedSectionGroupDto = response.data;
          }
        }, error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        }
      });
    }

    this.activePage = "detail";
  }

  setHeader(sectionGroupId: number): void {
    sectionGroupId == 0 ? this.cardHeader = "Site Grubu Ekle" : this.cardHeader = "Site Grubunu Düzenle";
  }

  updateSectionGroup(selectedSectionGroupDto: SectionGroupDto): void {
    this.sub6 = this.sectionGroupService.update(selectedSectionGroupDto).subscribe({
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
