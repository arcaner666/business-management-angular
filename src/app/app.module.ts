// Angular Modules
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Auth0 Angular JWT Modules
import { JwtModule } from '@auth0/angular-jwt';

// ng-bootstrap Module
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// ng-select Module
import { NgSelectModule } from '@ng-select/ng-select';

// Components
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';
import { AppComponent } from 'src/app/app.component';
import { BranchComponent } from 'src/app/components/manager/branch/branch.component';
import { BranchDetailComponent } from 'src/app/components/manager/branch/branch-detail/branch-detail.component';
import { BranchListComponent } from 'src/app/components/manager/branch/branch-list/branch-list.component';
import { ContentComponent } from 'src/app/components/layout/content/content.component';
import { CustomerDashboardComponent } from 'src/app/components/customer/customer-dashboard/customer-dashboard.component';
import { ErrorComponent } from 'src/app/components/public/error/error.component';
import { FooterComponent } from 'src/app/components/layout/footer/footer.component';
import { HomeComponent } from 'src/app/components/public/home/home.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { LoginComponent } from 'src/app/components/public/login/login.component';
import { ManagerDashboardComponent } from 'src/app/components/manager/manager-dashboard/manager-dashboard.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { NavbarComponent } from 'src/app/components/layout/navbar/navbar.component';
import { NotAuthorizedComponent } from 'src/app/components/public/not-authorized/not-authorized.component';
import { RegisterComponent } from 'src/app/components/public/register/register.component';
import { SidebarFloatingComponent } from 'src/app/components/layout/sidebar-floating/sidebar-floating.component';
import { SidebarStaticComponent } from 'src/app/components/layout/sidebar-static/sidebar-static.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';

// Interceptors
import { ErrorInterceptor } from 'src/app/interceptors/error.interceptor';

// Models
import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';

@NgModule({
  declarations: [
    // Components
    AdminDashboardComponent,
    AppComponent,
    BranchComponent,
    BranchDetailComponent,
    BranchListComponent,
    ContentComponent,
    CustomerDashboardComponent,
    ErrorComponent,
    FooterComponent,
    HomeComponent,
    LayoutComponent,
    LoginComponent,
    ManagerDashboardComponent,
    ModalComponent,
    NavbarComponent,
    NotAuthorizedComponent,
    RegisterComponent,
    SidebarFloatingComponent,
    SidebarStaticComponent,
    ToastComponent,
  ],
  imports: [
    // Angular Modules
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // Auth0 Angular JWT Modules
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          let authorizationDto: AuthorizationDto = JSON.parse(localStorage.getItem("authorizationDto")!);
          return authorizationDto?.accessToken;
        },
        allowedDomains: [
          "localhost:44324",
        ]
      },
    }),

    // ng-bootstrap Module
    NgbModule,

    // ng-select Module
    NgSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
