import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CityDto } from 'src/app/models/dtos/cityDto';
import { DistrictDto } from 'src/app/models/dtos/districtDto';
import { ListDataResult } from 'src/app/models/results/listDataResult';
import { ManagerExtDto } from 'src/app/models/dtos/managerExtDto';
import { ModuleOption } from 'src/app/models/various/module-option';
import { Result } from 'src/app/models/results/result';

import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { LayoutService } from 'src/app/services/layout.service';
import { ManagerService } from 'src/app/services/manager.service';

const EMPTY_RESULT: Result = {
  success: false, 
  message: "",
};

const EMPTY_MANAGER_EXT_DTO: ManagerExtDto = {
  managerId: 0,
  businessId: 0,
  branchId: 0,
  nameSurname: "",
  email: "",
  phone: "",
  dateOfBirth: new Date(),
  gender: "",
  notes: "",
  avatarUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended With Business
  businessName: "",

  // Extended With Branch + FullAddress
  cityId: 0,
  districtId: 0,
  addressText: "",
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registrationModal') registrationModal: ElementRef | undefined;

  public cityDtos$!: Observable<ListDataResult<CityDto>>;
  public companyManagerForm: FormGroup;
  public districtDtos$!: Observable<ListDataResult<DistrictDto>>;
  public loadingCompanyManagerForm: boolean = false;
  public loadingSectionManagerForm: boolean = false;
  public managerExtDto: ManagerExtDto = cloneDeep(EMPTY_MANAGER_EXT_DTO);
  public moduleForm: FormGroup;
  public moduleOptions: ModuleOption[] = [
    { id: 1, name: "Site Yönetimi" }, 
    { id: 2, name: "İşletme Yönetimi" }, 
    { id: 3, name: "Otel Yönetimi" },
  ];
  public modalResult: string = "";
  public result: Result = cloneDeep(EMPTY_RESULT);
  public sectionManagerForm: FormGroup;
  public submittedCompanyManagerForm: boolean = false;
  public submittedSectionManagerForm: boolean = false;
  
  // Angular 13 kursunda servisten gelen veriyi direk HTML template'ine async pipe'ı ile göndermekten bahsediyordu.
  private sub1: Subscription = new Subscription();
  private sub2: Subscription = new Subscription();

  constructor(
    private _cityService: CityService,
    private _districtService: DistrictService,
    private _formBuilder: FormBuilder,
    private _layoutService: LayoutService,
    private _managerService: ManagerService,
    private _modalService: NgbModal,
    private _router: Router,

    public breakpointService: BreakpointService
    ) {
    console.log("RegisterComponent constructor çalıştı.");

    // Bu sayfa için layout ayarlarını düzenler.
    this._layoutService.layoutConfig = {
      showNavbar: false,
      showSidebarStatic: false,
      showSidebarFloating: false,
      showFooter: false,
    };

    // Sunucudan şehirleri getirir ve modellere doldurur.
    this.getCities();

    // Modül formu oluşturulur.
    this.moduleForm = this._formBuilder.group({
      module: [1, [Validators.required]],
    });

    // Site yöneticisi kayıt formu oluşturulur.
    this.sectionManagerForm = this._formBuilder.group({
      businessName: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      districtId: ['', [Validators.required]],
      addressText: ['', [Validators.required]],
      nameSurname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      userAgreement: [false, [Validators.requiredTrue]],
    });

    // İşletme yöneticisi kayıt formu oluşturulur.
    this.companyManagerForm = this._formBuilder.group({
      businessName: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      districtId: ['', [Validators.required]],
      addressText: ['', [Validators.required]],
      nameSurname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      userAgreement: [false, [Validators.requiredTrue]],
    });
  }

  addCompanyManager() {
    // "Kayıt Ol" butonuna basıldığını belirtir.
    this.submittedCompanyManagerForm = true;

    // Form geçersizse burada durur.
    if (this.companyManagerForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.companyManagerForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loadingCompanyManagerForm = true;

    // Formdaki veriler sunucuya gönderilecek modele doldurulur.
    this.fillManagerExtDto(this.moduleForm.controls['module'].value);

    // Sunucuya kayıt isteği gönderilir.
    this.sub1 = this._managerService.addSectionManager(this.managerExtDto).subscribe({
      next: (response) => {
        // Kayıt işlemi başarılıysa yönlendirme modal'ını tetikler.
        if (response.success) {
          this.openRegistrationModal(this.registrationModal);
        }
        this.loadingCompanyManagerForm = false;
      }, error: (error) => {
        console.log(error);
        // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
        this.result.success = error.success;
        this.result.message = error.message;
        this.loadingCompanyManagerForm = false;
      }
    });
  }
  
  addSectionManager() {
    // "Kayıt Ol" butonuna basıldığını belirtir.
    this.submittedSectionManagerForm = true;

    // Önceki hata mesajları temizlenir.
    this.result = { success: false, message: ""};

    // Form geçersizse burada durur.
    if (this.sectionManagerForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.sectionManagerForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loadingSectionManagerForm = true;

    // Formdaki veriler sunucuya gönderilecek modele doldurulur.
    this.fillManagerExtDto(this.moduleForm.controls['module'].value);

    // Sunucuya kayıt isteği gönderilir.
    this.sub2 = this._managerService.addSectionManager(this.managerExtDto).subscribe({
      next: (response) => {
        // Kayıt işlemi başarılıysa yönlendirme modal'ını tetikler.
        if (response.success) {
          this.openRegistrationModal(this.registrationModal);
        }
        this.loadingSectionManagerForm = false;
      }, error: (error) => {
        console.log(error);
        // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
        this.result.success = error.success;
        this.result.message = error.message;
        this.loadingSectionManagerForm = false;
      }
    });
  }

  // Formdaki verileri modele doldurur.
  fillManagerExtDto(selectedModule: number) {
    switch (selectedModule) {
      case 1:
        this.managerExtDto.businessName = this.sectionManagerForm.controls['businessName'].value;
        this.managerExtDto.cityId = this.sectionManagerForm.controls['cityId'].value;
        this.managerExtDto.districtId = this.sectionManagerForm.controls['districtId'].value;
        this.managerExtDto.addressText = this.sectionManagerForm.controls['addressText'].value;
        this.managerExtDto.nameSurname = this.sectionManagerForm.controls['nameSurname'].value;
        this.managerExtDto.phone = this.sectionManagerForm.controls['phone'].value.toString();
        break;
      case 2:
        this.managerExtDto.businessName = this.sectionManagerForm.controls['businessName'].value;
        this.managerExtDto.cityId = this.sectionManagerForm.controls['cityId'].value;
        this.managerExtDto.districtId = this.sectionManagerForm.controls['districtId'].value;
        this.managerExtDto.addressText = this.sectionManagerForm.controls['addressText'].value;
        this.managerExtDto.nameSurname = this.sectionManagerForm.controls['nameSurname'].value;
        this.managerExtDto.phone = this.sectionManagerForm.controls['phone'].value.value.toString();
        break;
      default:
        break;
    }
  }

  // Sunucudan şehirleri getirir ve modellere doldurur.
  getCities() {
    this.cityDtos$ = this._cityService.getAll();
  }

  // İlçeleri sunucudan getirir ve modellere doldurur.
  getDistrictsByCityId(cityId: number): void {
    this.districtDtos$ = this._districtService.getByCityId(cityId);
  }

  openRegistrationModal(selectedModal: any) {
    this._modalService.open(selectedModal, {ariaLabelledBy: 'modal-basic-title'});
  }

  // Formda herhangi bir şehir seçildiğinde çalışır.
  selectCity(cityId: number){
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.managerExtDto.districtId = 0;
    this.sectionManagerForm.controls['districtId'].setValue(0);

    this.getDistrictsByCityId(cityId);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
