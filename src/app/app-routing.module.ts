// Angular Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from 'src/app/components/customer/customer-dashboard/customer-dashboard.component';
import { BranchComponent } from 'src/app/components/manager/branch/branch.component';
import { BranchDetailComponent } from 'src/app/components/manager/branch/branch-detail/branch-detail.component';
import { BranchListComponent } from 'src/app/components/manager/branch/branch-list/branch-list.component';
import { ErrorComponent } from 'src/app/components/public/error/error.component';
import { HomeComponent } from 'src/app/components/public/home/home.component';
import { LoginComponent } from 'src/app/components/public/login/login.component';
import { ManagerDashboardComponent } from 'src/app/components/manager/manager-dashboard/manager-dashboard.component';
import { NotAuthorizedComponent } from 'src/app/components/public/not-authorized/not-authorized.component';
import { RegisterComponent } from 'src/app/components/public/register/register.component';
import { SectionGroupComponent } from 'src/app/components/manager/section-group/section-group.component';
import { SectionGroupDetailComponent } from 'src/app/components/manager/section-group/section-group-detail/section-group-detail.component';
import { SectionGroupListComponent } from 'src/app/components/manager/section-group/section-group-list/section-group-list.component';

// Guards
import { AuthorizationGuard } from 'src/app/guards/authorization.guard';

const routes: Routes = [
  // Public
  { path: 'public/error', component: ErrorComponent },
  { path: 'public/home', component: HomeComponent },
  { path: 'public/login', component: LoginComponent },
  { path: 'public/not-authorized', component: NotAuthorizedComponent },
  { path: 'public/register', component: RegisterComponent },

  // Manager
  {
    path: 'manager/manager-dashboard', component: ManagerDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/branch', component: BranchComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/branch-list', component: BranchListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/branch-detail', component: BranchDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-group', component: SectionGroupComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-group-list', component: SectionGroupListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-group-detail', component: SectionGroupDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },

  // Customer
  {
    path: 'customer/customer-dashboard', component: CustomerDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Customer"] },
  },

  // Admin
  {
    path: 'admin/admin-dashboard', component: AdminDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Admin"] },
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
  imports: [RouterModule.forRoot(routes, {
    // Her route değişiminde gidilen sayfanın en üstüne odaklanır.
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
