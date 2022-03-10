import { cloneDeep } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { BranchExtDto } from 'src/app/models/dtos/branchExtDto';
import { CityDto } from 'src/app/models/dtos/cityDto';
import { DistrictDto } from 'src/app/models/dtos/districtDto';
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
  selector: 'app-branch-edit',
  templateUrl: './branch-edit.component.html',
  styleUrls: ['./branch-edit.component.scss']
})
export class BranchEditComponent implements OnInit {

  public branchExtForm: FormGroup;
  public cardHeader: string = "";
  public cityDtos$: Observable<ListDataResult<CityDto>>;
  public districtDtos: DistrictDto[] = [];
  public loading: boolean = false;
  public returnUrl: string = "/manager/branch-list";
  public selectedBranchExtDto: BranchExtDto = cloneDeep(EMPTY_BRANCH_EXT_DTO);
  public selectedBranchId: number;
  public selectedProcessType: number = 0;
  public submitted: boolean = false;
  public sub1: Subscription = new Subscription();
  public sub2: Subscription = new Subscription();
  public sub3: Subscription = new Subscription();
  public sub4: Subscription = new Subscription();
  public sub5: Subscription = new Subscription();
  public sub6: Subscription = new Subscription();
  
  constructor(
    private authorizationService: AuthorizationService,
    private branchService: BranchService,
    private cityService: CityService,
    private districtService: DistrictService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
  ) {
    console.log("BranchEditComponent constructor çalıştı.");

    // İlgili servisten seçili işlem türünü getirir.
    this.selectedProcessType = this.branchService.selectedProcessType;

    // İlgili servisten seçili modelin id'sini getirir.
    this.selectedBranchId = this.branchService.selectedBranchId;

    // İşlem türüne göre card'ın başlığı atanır.
    this.cardHeader = this.setCardHeader(this.selectedProcessType);

    // Eğer düzenleme yapılacaksa sunucudan seçili şubeyi getirir ve modellere doldurur.
    if (this.selectedProcessType == 2) {
      this.getBranchExtById(this.branchService.selectedBranchId);
    }

    // Sunucudan şehirleri getirir ve modellere doldurur.
    this.cityDtos$ = this.cityService.getAll();

    // Form oluşturulur.
    this.branchExtForm = this.formBuilder.group({
      businessId: ["", [Validators.required]],
      branchOrder: ["", [Validators.required]],
      branchName: ["", [Validators.required]],
      branchCode: ["", [Validators.required]],
      cityId: ["", [Validators.required]],
      districtId: ["", [Validators.required]],
      addressTitle: ["", [Validators.required]],
      postalCode: ["", [Validators.required]],
      addressText: ["", [Validators.required]],
    });

    // Eğer sayfa yenilendiyse servis içindeki düzenlenecek kayıt kaybolacağı için liste sayfasına geri yönlendirilir.
    if (!this.selectedBranchId && !this.selectedProcessType) {
      this.router.navigate([this.returnUrl]);
    }
  }

  // Sunucuya yeni bir şube ekleme isteği gönderilir.
  addExt(){
    // "Kaydet" butonuna basıldı.
    this.submitted = true;

    // Form geçersizse burada durur.
    if (this.branchExtForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.branchExtForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loading = true;

    // Formdaki verileri sunucuya gönderilecek modele doldurur.
    this.fillSelectedBranchExtDto();

    this.sub1 = this.branchService.addExt(this.selectedBranchExtDto).subscribe({
      next: (response) => {
        if(response.success) {
          // Kayıt başarıyla eklendiğinde toast ile bildirir.
          this.toastService.success(response.message);

          // Liste componentine döner.
          this.router.navigate([this.returnUrl]);
        }
        this.loading = false;
      }, error: (error) => {
        console.log(error);

        // Kayıt eklenemediğinde toast ile bildirir.
        this.toastService.danger(error.message);

        this.loading = false;
      }
    });
  }

  // Formdaki verileri modele doldurur.
  fillSelectedBranchExtDto() {
    this.selectedBranchExtDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.selectedBranchExtDto.branchOrder = this.branchExtForm.controls["branchOrder"].value;
    this.selectedBranchExtDto.branchName = this.branchExtForm.controls["branchName"].value;
    this.selectedBranchExtDto.branchCode = this.branchExtForm.controls["branchCode"].value;
    this.selectedBranchExtDto.cityId = this.branchExtForm.controls["cityId"].value;
    this.selectedBranchExtDto.districtId = this.branchExtForm.controls["districtId"].value;
    this.selectedBranchExtDto.addressTitle = this.branchExtForm.controls["addressTitle"].value;
    this.selectedBranchExtDto.postalCode = this.branchExtForm.controls["postalCode"].value;
    this.selectedBranchExtDto.addressText = this.branchExtForm.controls["addressText"].value;
  }

  // Modeldeki verileri forma doldurur.
  fillBranchForm() {
    this.branchExtForm.controls["businessId"].setValue(this.authorizationService.authorizationDto.businessId);
    this.branchExtForm.controls["branchOrder"].setValue(this.selectedBranchExtDto.branchOrder);
    this.branchExtForm.controls["branchName"].setValue(this.selectedBranchExtDto.branchName);
    this.branchExtForm.controls["branchCode"].setValue(this.selectedBranchExtDto.branchCode);
    this.branchExtForm.controls["cityId"].setValue(this.selectedBranchExtDto.cityId);
    this.branchExtForm.controls["districtId"].setValue(this.selectedBranchExtDto.districtId);
    this.branchExtForm.controls["addressTitle"].setValue(this.selectedBranchExtDto.addressTitle);
    this.branchExtForm.controls["postalCode"].setValue(this.selectedBranchExtDto.postalCode);
    this.branchExtForm.controls["addressText"].setValue(this.selectedBranchExtDto.addressText);
  }

  // Şube kodu üretir.
  generateBranchCode(){
    this.sub2 = this.branchService.generateBranchCode(this.authorizationService.authorizationDto.businessId).subscribe({
      next: (response) => {
        if(response.success) {
          this.branchExtForm.controls["branchOrder"].setValue(response.data.branchOrder);
          this.branchExtForm.controls["branchCode"].setValue(response.data.branchCode);
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  // Seçili şubeyi sunucudan getirir ve modellere doldurur.
  getBranchExtById(id: number): void {
    this.sub3 = this.branchService.getExtById(id).subscribe({
      next: (response) => {
        if (response.success) {
          // Sunucudan gelen veriyi modele doldurur.
          this.selectedBranchExtDto = response.data;

          // Modeldeki verileri forma doldurur.
          this.fillBranchForm();

          // Eğer bir şehir seçiliyse ilçeleri sunucudan getirir.
          this.getDistrictsByCityId(this.branchExtForm.controls["cityId"].value);
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }

  // İlçeleri sunucudan getirir ve modellere doldurur.
  getDistrictsByCityId(cityId: number): void {
    this.sub5 = this.districtService.getByCityId(cityId).subscribe({
      next: (response) => {
        if(response.success) {
          this.districtDtos = response.data;
        }
      }, error: (error) => {
        console.log(error);
      }
    });
  }
  
  // Formu sayfa ilk yüklendiğindeki haline getirir.
  resetBranchExtForm() {
    this.loading = false;
    this.submitted = false;
    this.branchExtForm.reset();
  }

  // Formda herhangi bir şehir seçildiğinde çalışır.
  selectCity(cityId: number){
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedBranchExtDto.districtId = 0;
    this.branchExtForm.controls["districtId"].setValue(0);

    this.getDistrictsByCityId(cityId);
  }
  
  // İşlem türüne göre card başlığını değiştirir.
  setCardHeader(processType: number): string {
    let header: string = "";
    if (processType == 1) {
      header = "Yeni Şube Ekle";
    } else if (processType == 2) {
      header = "Şubeyi Düzenle";
    }
    return header;
  }

  // İşlem türüne göre işlem yapar.
  submit(processType: number) {
    if (processType == 1) {
      this.addExt();
    } else if (processType == 2) {
      this.updateExt();
    }
  }

  // Sunucuya seçili şubeyi güncelleme isteği gönderilir.
  updateExt(){
    // "Kaydet" butonuna basıldı.
    this.submitted = true;

    // Form geçersizse burada durur.
    if (this.branchExtForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.branchExtForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loading = true;

    // Modeldeki verileri forma doldurur.
    this.fillSelectedBranchExtDto();

    this.sub6 = this.branchService.updateExt(this.selectedBranchExtDto).subscribe({
      next: (response) => {
        if(response.success) {
          // Kayıt başarıyla güncellendiğinde toast ile bildirir.
          this.toastService.success(response.message);

          // Liste componentine döner.
          this.router.navigate([this.returnUrl]);
        }
        this.loading = false;
      }, error: (error) => {
        console.log(error);

        // Kayıt güncellenemediğinde toast ile bildirir.
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
