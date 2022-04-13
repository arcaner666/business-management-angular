// Angular Modules
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Admin - Admin Dashboard Components
import { AdminDashboardComponent } from 'src/app/components/admin/admin-dashboard/admin-dashboard.component';

// Customer - Customer Dashboard Components
import { CustomerDashboardComponent } from 'src/app/components/customer/customer-dashboard/customer-dashboard.component';

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

// Public Components
import { ErrorComponent } from 'src/app/components/public/error/error.component';
import { HomeComponent } from 'src/app/components/public/home/home.component';
import { LoginComponent } from 'src/app/components/public/login/login.component';
import { NotAuthorizedComponent } from 'src/app/components/public/not-authorized/not-authorized.component';
import { RegisterComponent } from 'src/app/components/public/register/register.component';

// Guards
import { AuthorizationGuard } from 'src/app/guards/authorization.guard';

const routes: Routes = [
  // Public
  { path: 'public/error', component: ErrorComponent },
  { path: 'public/home', component: HomeComponent },
  { path: 'public/login', component: LoginComponent },
  { path: 'public/not-authorized', component: NotAuthorizedComponent },
  { path: 'public/register', component: RegisterComponent },

  // Manager - Dashboard
  {
    path: 'manager/manager-dashboard', component: ManagerDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },

  // Manager - Management
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
  
  // Manager - Sections
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
  {
    path: 'manager/section', component: SectionComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-list', component: SectionListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-detail', component: SectionDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/apartment', component: ApartmentComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/apartment-list', component: ApartmentListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/apartment-detail', component: ApartmentDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/flat', component: FlatComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/flat-list', component: FlatListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/flat-detail', component: FlatDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },

  // Manager - Accounting
  {
    path: 'manager/account-group', component: AccountGroupComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/account-group-list', component: AccountGroupListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/account', component: AccountComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/account-list', component: AccountListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/account-detail', component: AccountDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },

  // Customer - Dashboard
  {
    path: 'customer/customer-dashboard', component: CustomerDashboardComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Customer"] },
  },

  // Admin - Dashboard
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
