import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { BranchExtDto } from 'src/app/models/dtos/branchExtDto';
import { CityDto } from 'src/app/models/dtos/cityDto';
import { DistrictDto } from 'src/app/models/dtos/districtDto';
import { ListDataResult } from 'src/app/models/results/listDataResult';
import { Result } from 'src/app/models/results/result';
import { SingleDataResult } from 'src/app/models/results/singleDataResult';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { BranchService } from 'src/app/services/branch.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-branch-edit',
  templateUrl: './branch-edit.component.html',
  styleUrls: ['./branch-edit.component.scss']
})
export class BranchEditComponent implements OnInit {

  public branchForm: FormGroup;
  public cardHeader: string = "";
  public cityDtos$: Observable<ListDataResult<CityDto>>;
  public districtDtos$: Observable<ListDataResult<DistrictDto>>;
  public loading: boolean = false;
  public result: Result = { success: false, message: ""};
  public returnUrl: string = "manager/branch-list";
  public selectedBranchDto: BranchExtDto;
  public selectedBranchId: number;
  public selectedProcessType: number = 0;
  public submitted: boolean = false;

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

    // Form oluşturulur.
    this.branchForm = this.formBuilder.group({
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

    // Sunucudan şehirleri getirir ve modellere doldurur.
    this.getCities();

    // İşlem türüne göre card'ın başlığı atanır.
    this.cardHeader = this.setCardHeader(this.selectedProcessType);

    // Eğer düzenleme yapılacaksa sunucudan seçili şubeyi getirir ve modellere doldurur.
    if (this.selectedProcessType == 2) {
      this.getBranchById(this.branchService.selectedBranchId);
    }
    
    // Eğer sayfa yenilendiyse servis içindeki düzenlenecek kayıt kaybolacağı için liste sayfasına geri yönlendirilir.
    // if (!this.selectedBranchId && !this.selectedProcessType) {
    //   this.router.navigate([this.returnUrl]);
    // }
  }

  // Sunucuya yeni bir şube ekleme isteği gönderilir.
  add(){
    // "Kaydet" butonuna basıldı.
    this.submitted = true;

    // Önceki hata mesajları temizlenir.
    this.result = { success: false, message: ""};

    // Form geçersizse burada durur.
    if (this.branchForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.branchForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loading = true;

    // Formdaki verileri sunucuya gönderilecek modele doldurur.
    this.fillSelectedBranchDto();

    this.sub1 = this.branchService.addExt(this.selectedBranchDto).subscribe((response) => {
      if(response.success) {
        // Kayıt başarıyla eklendiğinde toastr ile bildirir.
        this._toastrService.success(response.message, 'İşlem Başarılı!', {
          closeButton: true,
          easeTime: 300,
          positionClass: 'toast-top-right',
          progressBar: true,
          timeOut: 3000,
          toastClass: 'toast ngx-toastr',
        });
      }
      this.loading = false;
      this.formBlockUI.stop();
    }, error => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.result.success = error.success;
      this.result.message = error.message;

      // Kayıt eklenemediğinde toastr ile bildirir.
      this._toastrService.error(error.message, 'Hata!', {
        closeButton: true,
        easeTime: 300,
        positionClass: 'toast-top-right',
        progressBar: true,
        timeOut: 3000,
        toastClass: 'toast ngx-toastr',
      });

      this.loading = false;
      this.formBlockUI.stop();
    });
  }

  // Formdaki verileri modele doldurur.
  fillSelectedBranchDto() {
    this.selectedBranchDto.businessId = this.authorizationService.authorizationDto.businessId;
    this.selectedBranchDto.branchOrder = this.branchForm.controls["branchOrder"].value;
    this.selectedBranchDto.branchName = this.branchForm.controls["branchName"].value;
    this.selectedBranchDto.branchCode = this.branchForm.controls["branchCode"].value;
    this.selectedBranchDto.cityId = this.branchForm.controls["cityId"].value;
    this.selectedBranchDto.districtId = this.branchForm.controls["districtId"].value;
    this.selectedBranchDto.addressTitle = this.branchForm.controls["addressTitle"].value;
    this.selectedBranchDto.postalCode = this.branchForm.controls["postalCode"].value;
    this.selectedBranchDto.addressText = this.branchForm.controls["addressText"].value;
  }

  // Modeldeki verileri forma doldurur.
  fillBranchForm() {
    this.branchForm.controls["businessId"].setValue(this.authorizationService.authorizationDto.businessId);
    this.branchForm.controls["branchOrder"].setValue(this.selectedBranchDto.branchOrder);
    this.branchForm.controls["branchName"].setValue(this.selectedBranchDto.branchName);
    this.branchForm.controls["branchCode"].setValue(this.selectedBranchDto.branchCode);
    this.branchForm.controls["cityId"].setValue(this.selectedBranchDto.cityId);
    this.branchForm.controls["districtId"].setValue(this.selectedBranchDto.districtId);
    this.branchForm.controls["addressTitle"].setValue(this.selectedBranchDto.addressTitle);
    this.branchForm.controls["postalCode"].setValue(this.selectedBranchDto.postalCode);
    this.branchForm.controls["addressText"].setValue(this.selectedBranchDto.addressText);
  }

  // Şube kodu üretir.
  generateBranchCode(){
    this.sub2 = this.branchService.generateBranchCode(this.authorizationService.authorizationDto.businessId).subscribe((response) => {
      if(response.success) {
        this.branchForm.controls["branchOrder"].setValue(response.data.branchOrder);
        this.branchForm.controls["branchCode"].setValue(response.data.branchCode);
      }
    }, error => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.result.success = error.success;
      this.result.message = error.message;
    });
  }

  // Seçili şubeyi sunucudan getirir ve modellere doldurur.
  getBranchById(id: number): void {
    this.sub3 = this.branchService.getById(id).subscribe({
      next: (response) => {
        if(response.success) {
          this.selectedBranchDto = response.data;
        }
      }, error: (error) => {
        console.log(error);
        // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
        this.result.success = error.success;
        this.result.message = error.message;
      }
    });
  }

  // Şehirleri sunucudan getirir ve modellere doldurur.
  getCities(): void {
    this.sub4 = this._cityService.getAll().subscribe((response) => {
      if(response.success) {
        this.cityDtos = response.data;
      }
    }, error => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.result.success = error.success;
      this.result.message = error.message;
    });
  }

  // İlçeleri sunucudan getirir ve modellere doldurur.
  getDistrictsByCityId(cityId: number): void {
    this.sub5 = this._districtService.getByCityId(cityId).subscribe((response) => {
      if(response.success) {
        this.districtDtos = response.data;
      }
    }, error => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.result.success = error.success;
      this.result.message = error.message;
    });
  }
  
  // Formu sayfa ilk yüklendiğindeki haline getirir.
  resetBranchExtForm() {
    this.loading = false;
    this.submitted = false;
    this.result.success = false;
    this.result.message = "";
    this.branchForm.reset();
  }

  // Formda herhangi bir şehir seçildiğinde çalışır.
  selectCity(cityId: number){
    // Şehir listesi her yenilendiğinde ilçe listesi de sıfırlanmalı.
    this.selectedBranchDto.districtId = undefined;
    this.branchForm.controls["districtId"].setValue(undefined);

    this.getDistrictsByCityId(cityId);
  }
  
  // İşlem türüne göre card başlığını değiştirir.
  setCardHeader(processType: number) {
    let header: string;
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
      this.add();
    } else if (processType == 2) {
      this.update();
    }
  }

  // Sunucuya seçili şubeyi güncelleme isteği gönderilir.
  update(){
    // "Kaydet" butonuna basıldı.
    this.submitted = true;

    // Önceki hata mesajları temizlenir.
    this.result = { success: false, message: ""};

    // Form geçersizse burada durur.
    if (this.branchForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.branchForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loading = true;

    // Modeldeki verileri forma doldurur.
    this.fillSelectedBranchDto();

    this.sub6 = this.branchService.updateExt(this.selectedBranchDto).subscribe((response) => {
      if(response.success) {
        // Kayıt başarıyla güncellendiğinde toastr ile bildirir.
        this._toastrService.success(response.message, 'İşlem Başarılı!', {
          closeButton: true,
          easeTime: 300,
          positionClass: 'toast-top-right',
          progressBar: true,
          timeOut: 3000,
          toastClass: 'toast ngx-toastr',
        });
      }
      this.loading = false;
    }, error => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.result.success = error.success;
      this.result.message = error.message;

      // Kayıt güncellenemediğinde toastr ile bildirir.
      this._toastrService.error(error.message, 'Hata!', {
        closeButton: true,
        easeTime: 300,
        positionClass: 'toast-top-right',
        progressBar: true,
        timeOut: 3000,
        toastClass: 'toast ngx-toastr',
      });

      this.loading = false;
    });
  }

  ngOnInit(): void {
    // Modeldeki verileri forma doldurur.
    this.fillBranchForm();

    // Eğer bir şehir seçiliyse ilçeleri sunucudan getirir.
    if (this.selectedProcessType == 2) {
      this.getDistrictsByCityId(this.branchForm.controls["cityId"].value);
    }
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
