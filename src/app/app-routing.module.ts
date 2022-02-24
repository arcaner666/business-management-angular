// Angular Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './components/customer/customer-dashboard/customer-dashboard.component';
import { ErrorComponent } from './components/public/error/error.component';
import { HomeComponent } from './components/public/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { ManagerDashboardComponent } from './components/manager/manager-dashboard/manager-dashboard.component';
import { NotAuthorizedComponent } from './components/public/not-authorized/not-authorized.component';
import { RegisterComponent } from './components/public/register/register.component';

// Guards
import { AuthorizationGuard } from './guards/authorization.guard';

const routes: Routes = [
  // Public
  { path: 'public/error', component: ErrorComponent },
  { path: 'public/home', component: HomeComponent },
  { path: 'public/login', component: LoginComponent },
  { path: 'public/not-authorized/:returnUrl', component: NotAuthorizedComponent },
  { path: 'public/register', component: RegisterComponent },

  // Manager
  {
    path: 'manager/manager-dashboard', component: ManagerDashboardComponent, canActivate: [AuthorizationGuard],
    data: { roles: ["Manager"] }
  },

  // Customer
  {
    path: 'customer/customer-dashboard', component: CustomerDashboardComponent, canActivate: [AuthorizationGuard],
    data: { roles: ["Customer"] }
  },

  // Admin
  {
    path: 'admin/admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthorizationGuard],
    data: { roles: ["Admin"] }
  },

  // Last
  {
    path: '',
    redirectTo: '/public/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/public/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
