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
import { AppComponent } from 'src/app/app.component';

// Admin - Admin Dashboard Components
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';

// Customer - Customer Dashboard Components
import { CustomerDashboardComponent } from 'src/app/components/customer/customer-dashboard/customer-dashboard.component';

// Layout Components
import { ContentComponent } from 'src/app/components/layout/content/content.component';
import { FooterComponent } from 'src/app/components/layout/footer/footer.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { NavbarComponent } from 'src/app/components/layout/navbar/navbar.component';
import { SidebarFloatingComponent } from 'src/app/components/layout/sidebar-floating/sidebar-floating.component';
import { SidebarStaticComponent } from 'src/app/components/layout/sidebar-static/sidebar-static.component';

// Manager - Accounting Components
import { AccountComponent } from 'src/app/components/manager/accounting/account/account.component';
import { AccountDetailComponent } from 'src/app/components/manager/accounting/account/account-detail/account-detail.component';
import { AccountListComponent } from 'src/app/components/manager/accounting/account/account-list/account-list.component';

import { AccountGroupComponent } from 'src/app/components/manager/accounting/account-group/account-group.component';
import { AccountGroupListComponent } from 'src/app/components/manager/accounting/account-group/account-group-list/account-group-list.component';

// Manager - Management Components
import { BranchComponent } from 'src/app/components/manager/management/branch/branch.component';
import { BranchDetailComponent } from 'src/app/components/manager/management/branch/branch-detail/branch-detail.component';
import { BranchListComponent } from 'src/app/components/manager/management/branch/branch-list/branch-list.component';

// Manager - Manager Dashboard Components
import { ManagerDashboardComponent } from 'src/app/components/manager/manager-dashboard/manager-dashboard.component';

// Manager - Persons Components
//...

// Manager - Sections Components
import { ApartmentComponent } from 'src/app/components/manager/sections/apartment/apartment.component';
import { ApartmentDetailComponent } from 'src/app/components/manager/sections/apartment/apartment-detail/apartment-detail.component';
import { ApartmentListComponent } from 'src/app/components/manager/sections/apartment/apartment-list/apartment-list.component';

import { FlatComponent } from 'src/app/components/manager/sections/flat/flat.component';
import { FlatListComponent } from 'src/app/components/manager/sections/flat/flat-list/flat-list.component';
import { FlatDetailComponent } from 'src/app/components/manager/sections/flat/flat-detail/flat-detail.component';

import { SectionComponent } from 'src/app/components/manager/sections/section/section.component';
import { SectionDetailComponent } from 'src/app/components/manager/sections/section/section-detail/section-detail.component';
import { SectionListComponent } from 'src/app/components/manager/sections/section/section-list/section-list.component';

import { SectionGroupComponent } from 'src/app/components/manager/sections/section-group/section-group.component';
import { SectionGroupDetailComponent } from 'src/app/components/manager/sections/section-group/section-group-detail/section-group-detail.component';
import { SectionGroupListComponent } from 'src/app/components/manager/sections/section-group/section-group-list/section-group-list.component';

// Modal Components
import { ModalComponent } from 'src/app/components/modal/modal.component';

// Public Components
import { ErrorComponent } from 'src/app/components/public/error/error.component';
import { HomeComponent } from 'src/app/components/public/home/home.component';
import { LoginComponent } from 'src/app/components/public/login/login.component';
import { NotAuthorizedComponent } from 'src/app/components/public/not-authorized/not-authorized.component';
import { RegisterComponent } from 'src/app/components/public/register/register.component';

// Toast Components
import { ToastComponent } from 'src/app/components/toast/toast.component';

// Interceptors
import { ErrorInterceptor } from 'src/app/interceptors/error.interceptor';

// Models
import { AuthorizationDto } from 'src/app/models/dtos/authorization-dto';
import { HouseOwnerComponent } from './components/manager/persons/house-owner/house-owner.component';
import { HouseOwnerDetailComponent } from './components/manager/persons/house-owner/house-owner-detail/house-owner-detail.component';
import { HouseOwnerListComponent } from './components/manager/persons/house-owner/house-owner-list/house-owner-list.component';
import { TenantComponent } from './components/manager/persons/tenant/tenant.component';
import { TenantListComponent } from './components/manager/persons/tenant/tenant-list/tenant-list.component';
import { TenantDetailComponent } from './components/manager/persons/tenant/tenant-detail/tenant-detail.component';
import { EmployeeComponent } from './components/manager/persons/employee/employee.component';
import { EmployeeListComponent } from './components/manager/persons/employee/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './components/manager/persons/employee/employee-detail/employee-detail.component';

@NgModule({
  declarations: [

    AppComponent,

    // Admin - Admin Dashboard Components
    AdminDashboardComponent,

    // Customer - Customer Dashboard Components
    CustomerDashboardComponent,

    // Layout Components
    ContentComponent,
    FooterComponent,
    LayoutComponent,
    NavbarComponent,
    SidebarFloatingComponent,
    SidebarStaticComponent,

    // Manager - Accounting Components
    AccountComponent,
    AccountDetailComponent,
    AccountListComponent,
    AccountGroupComponent,
    AccountGroupListComponent,

    // Manager - Management Components
    BranchComponent,
    BranchDetailComponent,
    BranchListComponent,

    // Manager - Manager Dashboard Components
    ManagerDashboardComponent,

    // Manager - Persons Components
    //...

    // Manager - Sections Components
    ApartmentComponent,
    ApartmentDetailComponent,
    ApartmentListComponent,
    FlatComponent,
    FlatListComponent,
    FlatDetailComponent,
    SectionComponent,
    SectionDetailComponent,
    SectionListComponent,
    SectionGroupComponent,
    SectionGroupDetailComponent,
    SectionGroupListComponent,

    // Modal Components
    ModalComponent,

    // Public Components
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    NotAuthorizedComponent,
    RegisterComponent,

    // Toast Components
    ToastComponent,
    HouseOwnerComponent,
    HouseOwnerDetailComponent,
    HouseOwnerListComponent,
    TenantComponent,
    TenantListComponent,
    TenantDetailComponent,
    EmployeeComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,
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
          "localhost:5001",
          "localhost:5000",
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
