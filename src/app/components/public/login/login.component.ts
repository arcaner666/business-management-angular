import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';
import { Result } from 'src/app/models/results/result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/services/toast.service';

const EMPTY_AUTHORIZATION_DTO: AuthorizationDto = {
  systemUserId: 0,
  email: "",
  phone: "",
  role: "",
  businessId: 0,
  branchId: 0,
  blocked: false,
  refreshToken: "",
  refreshTokenExpiryTime: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),

  // Extended
  password: "",
  refreshTokenDuration: 0,
  accessToken: "",
};

const EMPTY_RESULT: Result = {
  success: false, 
  message: "",
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  public authorizationDto: AuthorizationDto = cloneDeep(EMPTY_AUTHORIZATION_DTO);
  public emailForm: FormGroup;
  public loadingPhone: boolean = false;
  public loadingEmail: boolean = false;
  public passwordTextType: boolean = false;
  public phoneForm: FormGroup;
  public refreshTokenDurationOptions = [{ id: 1, duration: '1 saat boyunca' }, { id: 24, duration: '1 gün boyunca' }, { id: 168, duration: '1 hafta boyunca' }, { id: 720, duration: '1 ay boyunca' }, { id: 999999, duration: 'Süresiz' }];
  public result: Result = cloneDeep(EMPTY_RESULT);
  public submittedPhone: boolean = false;
  public submittedEmail: boolean = false;

  private sub1: Subscription = new Subscription();
  private sub2: Subscription = new Subscription();

  constructor(
    private authorizationService: AuthorizationService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private toastService: ToastService,

    public breakpointService: BreakpointService
  ) {
    console.log("LoginComponent constructor çalıştı.");

    // Oturum açılma durumuna göre kullanıcıları yönlendir.
    this.navigationService.navigateByRole(this.authorizationService.authorizationDto?.role);

    // Sidebar linklerini düzenle.
    this.navigationService.loadSidebarLinksByRole();

    // Telefonla giriş formu oluşturulur.
    this.phoneForm = this.formBuilder.group({
      phone: ["5554443322", [Validators.required]],
      password: ["123456", [Validators.required]],
      refreshTokenDuration: [1, [Validators.required]],
    });

    // E-postayla giriş formu oluşturulur.
    this.emailForm = this.formBuilder.group({
      email: ["caner@mail.com", [Validators.required]],
      password: ["123456", [Validators.required]],
      refreshTokenDuration: [1, [Validators.required]],
    });
  }

  // Şifre göstermeyi tetikler.
  togglePasswordTextType(): void  {
    this.passwordTextType = !this.passwordTextType;
  }

  loginWithEmail(): void  {
    // "Giriş Yap" butonuna basıldı.
    this.submittedEmail = true;

    // Form geçersizse burada durur.
    if (this.emailForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.emailForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loadingEmail = true;
    
    // Formdaki veriler sunucuya gönderilecek modele doldurulur.
    this.authorizationDto.email = this.emailForm.value.email;
    this.authorizationDto.password = this.emailForm.value.password;
    this.authorizationDto.refreshTokenDuration = this.emailForm.value.refreshTokenDuration;

    this.sub1 = this.authorizationService.loginWithEmail(this.authorizationDto).subscribe({
      next: (response) => {      
        // Eğer giriş başarılıysa
        if(response.success) {
          // Kullanıcı bilgilerini sakla.
          this.authorizationService.authorizationDto = response.data;

          // Oturum açılma durumuna göre kullanıcıları yönlendir.
          this.navigationService.navigateByRole(this.authorizationService.authorizationDto?.role);

          // Sidebar linklerini düzenle.
          this.navigationService.loadSidebarLinksByRole();
        }
        this.loadingEmail = false;
      },
      error: (error) => {
        console.log(error);
        // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
        this.result.success = error.success;
        this.result.message = error.message;
        this.loadingEmail = false;
      }
    });
  }

  loginWithPhone(): void {
    // "Giriş Yap" butonuna basıldı.
    this.submittedPhone = true;

    // Form geçersizse burada durur.
    if (this.phoneForm.invalid) {
      console.log("Form geçersiz.");
      console.log(this.phoneForm);
      return;
    }

    // Sunucuya bir istek yapıldığını ve cevap beklendiğini belirtir.
    this.loadingPhone = true;
    
    // Formdaki veriler sunucuya gönderilecek modele doldurulur.
    this.authorizationDto.phone = this.phoneForm.value.phone.toString();
    this.authorizationDto.password = this.phoneForm.value.password;
    this.authorizationDto.refreshTokenDuration = this.phoneForm.value.refreshTokenDuration;

    // Sunucuya giriş isteği gönderilir.
    this.sub2 = this.authorizationService.loginWithPhone(this.authorizationDto).subscribe({
        next: (response) => {      
          // Eğer giriş başarılıysa
          if(response.success) {
            // Ekranda girişin başarılı olduğuna dair toast mesajı gösterir.
            this.toastService.success(response.message);

            // Kullanıcı bilgilerini sakla.
            this.authorizationService.authorizationDto = response.data;

            // Oturum açılma durumuna göre kullanıcıları yönlendir.
            this.navigationService.navigateByRole(this.authorizationService.authorizationDto?.role);

            // Sidebar linklerini düzenle.
            this.navigationService.loadSidebarLinksByRole();
          }
          this.loadingPhone = false;
        },
        error: (error) => {
          console.log(error);
          // error.interceptor.ts'de dönen yanıt ile ilgili açıklama yapılmıştır.
          this.result.success = error.success;
          this.result.message = error.message;
          this.loadingPhone = false;
        }
    });
  }

  // Giriş tipleri arasında geçiş yapıldığında formları varsayılan hallerine getirir.
  resetForms(): void  {
    this.result = cloneDeep(EMPTY_RESULT);

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
