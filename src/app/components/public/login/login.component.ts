import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil} from 'rxjs';

import { AuthorizationDto } from 'src/app/models/dtos/authorization-dto';
import { Result } from 'src/app/models/results/result';

import { AuthorizationService } from 'src/app/services/authorization.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  public authorizationDto: AuthorizationDto;
  public emailForm: FormGroup;
  public loadingPhone: boolean = false;
  public loadingEmail: boolean = false;
  public passwordTextType: boolean = false;
  public phoneForm: FormGroup;
  public refreshTokenDurationOptions = [
    { duration: 3600, text: '1 saat boyunca' }, 
    { duration: 86400, text: '1 gün boyunca' }, 
    { duration: 604800, text: '1 hafta boyunca' }, 
    { duration: 18144000, text: '1 ay boyunca' }, 
    { duration: 999999999, text: 'Süresiz' }
  ];
  public result: Result = {
    success: false, 
    message: "",
  };
  public submittedPhone: boolean = false;
  public submittedEmail: boolean = false;

  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private authorizationService: AuthorizationService,
    private formBuilder: FormBuilder,
    private navigationService: NavigationService,
    private toastService: ToastService,

    public breakpointService: BreakpointService
  ) {
    console.log("LoginComponent constructor çalıştı.");

    this.authorizationDto = this.authorizationService.emptyAuthorizationDto;
    
    // Oturum açılma durumuna göre kullanıcıları yönlendir.
    this.navigationService.navigateByRole(this.authorizationService.authorizationDto?.role);

    // Sidebar linklerini düzenle.
    this.navigationService.loadSidebarLinksByRole();

    // Telefonla giriş formu oluşturulur.
    this.phoneForm = this.formBuilder.group({
      phone: ["5554443322", [Validators.required]],
      password: ["123456", [Validators.required]],
      refreshTokenDuration: [3600, [Validators.required]],
    });

    // E-postayla giriş formu oluşturulur.
    this.emailForm = this.formBuilder.group({
      email: ["caner@mail.com", [Validators.required]],
      password: ["123456", [Validators.required]],
      refreshTokenDuration: [3600, [Validators.required]],
    });
  }

  // Şifre göstermeyi tetikler.
  togglePasswordTextType(): void {
    this.passwordTextType = !this.passwordTextType;
  }

  loginWithEmail(): void {
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

    this.authorizationService.loginWithEmail(this.authorizationDto)
    .pipe(
      takeUntil(this.unsubscribeAll),
    ).subscribe({
      // Eğer giriş başarılıysa
      next: (response) => {      
        // Kullanıcı bilgilerini sakla.
        this.authorizationService.authorizationDto = response.data;

        // Oturum açılma durumuna göre kullanıcıları yönlendir.
        this.navigationService.navigateByRole(this.authorizationService.authorizationDto?.role);

        // Sidebar linklerini düzenle.
        this.navigationService.loadSidebarLinksByRole();

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
    this.authorizationService.loginWithPhone(this.authorizationDto)
    .pipe(
      takeUntil(this.unsubscribeAll),
      ).subscribe({
      // Eğer giriş başarılıysa
        next: (response) => {      
          // Ekranda girişin başarılı olduğuna dair toast mesajı gösterir.
          this.toastService.success(response.message);

          // Kullanıcı bilgilerini sakla.
          this.authorizationService.authorizationDto = response.data;

          // Oturum açılma durumuna göre kullanıcıları yönlendir.
          this.navigationService.navigateByRole(this.authorizationService.authorizationDto?.role);

          // Sidebar linklerini düzenle.
          this.navigationService.loadSidebarLinksByRole();

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
    this.result = {
      success: false, 
      message: "",
    };

    this.phoneForm.reset({
      phone: "5554443322",
      password: "123456",
      refreshTokenDuration: 3600,
    });

    this.emailForm.reset({
      email: "caner@mail.com",
      password: "123456",
      refreshTokenDuration: 3600,
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
