import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Observable, concatMap, Subject, takeUntil, tap, EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ListDataResult } from 'src/app/models/results/list-data-result';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';
import { SectionGroupDtoErrors } from 'src/app/models/validation-errors/section-group-dto-errors';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { SectionGroupService } from 'src/app/services/section-group.service';
import { ToastService } from 'src/app/services/toast.service';
import { ValidationService } from 'src/app/services/validation.service';

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
  public selectedSectionGroupDto: SectionGroupDto;
  public selectedSectionGroupDtoErrors: SectionGroupDtoErrors;

  private unsubscribeAll: Subject<void> = new Subject<void>();
  
  constructor(
    private authorizationService: AuthorizationService,
    private modalService: NgbModal,
    private sectionGroupService: SectionGroupService,
    private toastService: ToastService,
    private validationService: ValidationService,
  ) { 
    console.log("SectionGroupComponent constructor çalıştı.");

    this.selectedSectionGroupDto = this.sectionGroupService.emptySectionGroupDto;
    this.selectedSectionGroupDtoErrors = this.sectionGroupService.emptySectionGroupDtoErrors;

    this.sectionGroupDtos$ = this.getSectionGroupsByBusinessId();
  }

  add(): void {
    // Sunucuya gönderilecek modelin businessId ve branchId kısmını günceller.
    this.selectedSectionGroupDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.selectedSectionGroupDto.branchId = this.authorizationService.authorizationDto.branchId;

    let [isModelValid, errors] = this.validationService.validateSectionGroupDto(this.selectedSectionGroupDto, "add");
    this.selectedSectionGroupDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.sectionGroupService.add(this.selectedSectionGroupDto)
      .pipe(
        takeUntil(this.unsubscribeAll),
        concatMap((response) => {
          this.toastService.success(response.message);
          this.activePage = "list";
          window.scroll(0,0);
          this.loading = false;
          
          return this.getSectionGroupsByBusinessId();
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
      console.log(this.selectedSectionGroupDtoErrors);
    }
  }

  cancel(): void {
    this.activePage = "list";
    window.scroll(0,0);
  }

  delete(selectedSectionGroupDto: SectionGroupDto): void {
    this.sectionGroupService.getById(selectedSectionGroupDto.sectionGroupId)
    .pipe(
      takeUntil(this.unsubscribeAll),
      concatMap((response) => {
        this.selectedSectionGroupDto = response.data;
        // Silinecek kayıt sunucudan tekrar getirildikten sonra silme modal'ı açılır.
        return this.modalService.open(this.deleteModal, {
            ariaLabelledBy: 'modal-basic-title',
            centered: true
          }).result;
        }),
      // Burada response, açılan modal'daki seçeneklere verilen yanıtı tutar.
      concatMap((response) => {
        if (response == "ok") {
          return this.sectionGroupService.delete(selectedSectionGroupDto.sectionGroupId)
          .pipe(
            tap((response) => {
              this.toastService.success(response.message);
            })
          );
        }
        return EMPTY;
      }),
      concatMap(() => {
        return this.getSectionGroupsByBusinessId();
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

  getSectionGroupsByBusinessId(): Observable<ListDataResult<SectionGroupDto>> {
    return this.sectionGroupService.getByBusinessId(this.authorizationService.authorizationDto.businessId);
  }

  save(selectedSectionGroupDto: SectionGroupDto): void {
    if (selectedSectionGroupDto.sectionGroupId == 0) {
      this.add();
    } else {
      this.update();
    }
  }

  select(selectedSectionGroupDto: SectionGroupDto): void {
    this.selectedSectionGroupDto = this.sectionGroupService.emptySectionGroupDto;

    if (!selectedSectionGroupDto) {  
      selectedSectionGroupDto = this.sectionGroupService.emptySectionGroupDto;    
    } 

    this.setHeader(selectedSectionGroupDto.sectionGroupId);

    if (selectedSectionGroupDto.sectionGroupId != 0) {
      this.sectionGroupService.getById(selectedSectionGroupDto.sectionGroupId)
      .pipe(
        takeUntil(this.unsubscribeAll),
      ).subscribe({
        next: (response) => {
          this.selectedSectionGroupDto = response.data;
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

  update(): void {
    let [isModelValid, errors] = this.validationService.validateSectionGroupDto(this.selectedSectionGroupDto, "update");
    this.selectedSectionGroupDtoErrors = errors;
    if (isModelValid) {
      this.loading = true;
      this.sectionGroupService.update(this.selectedSectionGroupDto)
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
      console.log(this.selectedSectionGroupDtoErrors);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
