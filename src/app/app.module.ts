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
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AppComponent } from './app.component';
import { CustomerDashboardComponent } from './components/customer/customer-dashboard/customer-dashboard.component';
import { ContentComponent } from './components/layout/content/content.component';
import { ErrorComponent } from './components/public/error/error.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { HomeComponent } from './components/public/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/public/login/login.component';
import { ManagerDashboardComponent } from './components/manager/manager-dashboard/manager-dashboard.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { NotAuthorizedComponent } from './components/public/not-authorized/not-authorized.component';
import { RegisterComponent } from './components/public/register/register.component';
import { SidebarFloatingComponent } from './components/layout/sidebar-floating/sidebar-floating.component';
import { SidebarStaticComponent } from './components/layout/sidebar-static/sidebar-static.component';

// Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Models
import { AuthorizationDto } from 'src/app/models/dtos/authorizationDto';

@NgModule({
  declarations: [
    // Components
    AdminDashboardComponent,
    AppComponent,
    ContentComponent,
    CustomerDashboardComponent,
    ErrorComponent,
    FooterComponent,
    HomeComponent,
    LayoutComponent,
    LoginComponent,
    ManagerDashboardComponent,
    NavbarComponent,
    NotAuthorizedComponent,
    RegisterComponent,
    SidebarFloatingComponent,
    SidebarStaticComponent,
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
