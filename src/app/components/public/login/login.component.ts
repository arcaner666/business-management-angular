import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';
import { Role } from 'src/app/models/various/role';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { NavigationService } from 'src/app/services/navigation.service';

const EMPTY_AUTHORIZATION_DTO: AuthorizationDto = {
  systemUserId: BigInt(0),
  email: "",
  phone: "",
  role2: "",
  dateOfBirth: new Date(),
  businessId: 0,
  branchId: BigInt(0),
  blocked: false,
  refreshToken: "",
  refreshTokenExpiryTime: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended
  password: "",
  refreshTokenDuration: 0,
  accessToken: "",
  role: Role.Anonymous,
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  public authorizationDto: AuthorizationDto;
  public errorPhone: string = "";
  public errorEmail: string = "";
  public loadingPhone: boolean = false;
  public loadingEmail: boolean = false;
  public phoneForm: FormGroup;
  public emailForm: FormGroup;
  public passwordTextType: boolean = false;
  public refreshTokenDurationOptions = [{ id: 1, duration: '1 saat boyunca' }, { id: 24, duration: '1 gün boyunca' }, { id: 168, duration: '1 hafta boyunca' }, { id: 720, duration: '1 ay boyunca' }, { id: 999999, duration: 'Süresiz' }];
  public submittedPhone: boolean = false;
  public submittedEmail: boolean = false;

  // Subscribe artık Rx.js'de kullanılmayacakmış ayrıca angular 13 kursunda servisten gelen veriyi direk HTML template'ine async pipe'ı ile göndermekten bahsediyordu.
  private sub1: Subscription = new Subscription();
  private sub2: Subscription = new Subscription();

  constructor(
    private _authorizationService: AuthorizationService,
    private _formBuilder: FormBuilder,
    private _navigationService: NavigationService,
  ) {
    console.log("LoginComponent constructor çalıştı.");

    // Boş AuthorizationDto'yu oluşturur.
    this.authorizationDto = cloneDeep(EMPTY_AUTHORIZATION_DTO);

    // Oturum açılma durumuna göre kullanıcıları yönlendir.
    this._navigationService.navigateByRole(this._authorizationService.authorizationDto?.role);

    // Telefonla giriş formu oluşturulur.
    this.phoneForm = this._formBuilder.group({
      phone: ["5554443322", [Validators.required]],
      password: ["123456", [Validators.required]],
      refreshTokenDuration: [1, [Validators.required]],
    });

    // E-postayla giriş formu oluşturulur.
    this.emailForm = this._formBuilder.group({
      email: ["caner@mail.com", [Validators.required]],
      password: ["123456", [Validators.required]],
      refreshTokenDuration: [1, [Validators.required]],
    });
  }

  // Şifre göstermeyi tetikler.
  togglePasswordTextType(): void  {
    this.passwordTextType = !this.passwordTextType;
  }

  // Sunucudan authorizationDto.role alanını enum olarak döndürmek istemediğim için string olarak
  // döndürüp burada Role'a çeviriyorum. Eğer authorizationDto nesnesindeki role alanı boş olursa
  // menüler düzgün çalışmaz.
  assignRoles(role2: string): void {
    if(role2) {
      switch (role2) {
        case "Admin": this.authorizationDto.role = Role.Admin; break;
        case "Manager": this.authorizationDto.role = Role.Manager; break;
        case "Customer": this.authorizationDto.role = Role.Customer; break;
      }
      console.log(role2);
    } else {
      console.log("Rol atanmamış!!!");
    }
  }

  loginWithEmail(): void  {
    // "Giriş Yap" butonuna basıldı.
    this.submittedEmail = true;

    // Form geçersizse burada durur.
    if (this.emailForm.invalid) {
      console.log("Form geçersiz.");
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loadingEmail = true;
    
    // Formdaki veriler sunucuya gönderilecek modele doldurulur.
    this.authorizationDto.email = this.emailForm.value.email;
    this.authorizationDto.password = this.emailForm.value.password;
    this.authorizationDto.refreshTokenDuration = this.emailForm.value.refreshTokenDuration;

    // Sunucuya giriş isteği gönderilir.
    this.sub1 = this._authorizationService.loginWithEmail(this.authorizationDto).subscribe((response) => {
      // Eğer giriş başarılıysa
      if(response.success) {
        // Rolleri ata. authorizationDto'yu değiştirdiği için en üstte olmalı.
        this.assignRoles(response.data.role2);

        // Kullanıcı bilgilerini sakla.
        this._authorizationService.authorizationDto = response.data;

        // Oturum açılma durumuna göre kullanıcıları yönlendir.
        this._navigationService.navigateByRole(this._authorizationService.authorizationDto?.role);
      }
      this.loadingEmail = false;
    }, error => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.errorEmail = error.message;
      this.loadingEmail = false;
    });
  }

  loginWithPhone(): void {
    // "Giriş Yap" butonuna basıldı.
    this.submittedPhone = true;

    // Form geçersizse burada durur.
    if (this.phoneForm.invalid) {
      console.log("Form geçersiz.");
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loadingPhone = true;
    
    // Formdaki veriler sunucuya gönderilecek modele doldurulur.
    this.authorizationDto.phone = this.phoneForm.value.phone;
    this.authorizationDto.password = this.phoneForm.value.password;
    this.authorizationDto.refreshTokenDuration = this.phoneForm.value.refreshTokenDuration;

    // Sunucuya giriş isteği gönderilir.
    this.sub2 = this._authorizationService.loginWithPhone(this.authorizationDto).subscribe((response) => {
      // Eğer giriş başarılıysa
      if(response.success) {
        // Rolleri ata. authorizationDto'yu değiştirdiği için en üstte olmalı.
        this.assignRoles(response.data.role2);

        // Kullanıcı bilgilerini sakla.
        this._authorizationService.authorizationDto = response.data;
        
        // Oturum açılma durumuna göre kullanıcıları yönlendir.
        this._navigationService.navigateByRole(this._authorizationService.authorizationDto?.role);
      }
      this.loadingPhone = false;
    }, error => {
      console.log(error);
      // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
      this.errorPhone = error.message;
      this.loadingPhone = false;
    });
  }

  // Giriş tipleri arasında geçiş yapıldığında formları varsayılan hallerine getirir.
  resetForms(): void  {
    this.phoneForm.reset({
      phone: "5554443322",
      password: "123456",
      refreshTokenDuration: 1,
    });

    this.emailForm.reset({
      email: "caner@mail.com",
      password: "123456",
      refreshTokenDuration: 1,
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if(this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
