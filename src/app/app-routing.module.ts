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

// Manager - General Management Components
import { BranchComponent } from 'src/app/components/manager/general-management/branch/branch.component';
import { BranchDetailComponent } from 'src/app/components/manager/general-management/branch/branch-detail/branch-detail.component';
import { BranchListComponent } from 'src/app/components/manager/general-management/branch/branch-list/branch-list.component';

// Manager - Manager Dashboard Components
import { ManagerDashboardComponent } from 'src/app/components/manager/manager-dashboard/manager-dashboard.component';

// Manager - Person Management Components
import { EmployeeComponent } from 'src/app/components/manager/person-management/employee/employee.component';
import { EmployeeListComponent } from 'src/app/components/manager/person-management/employee/employee-list/employee-list.component';
import { EmployeeDetailComponent } from 'src/app/components/manager/person-management/employee/employee-detail/employee-detail.component';

import { HouseOwnerComponent } from 'src/app/components/manager/person-management/house-owner/house-owner.component';
import { HouseOwnerDetailComponent } from 'src/app/components/manager/person-management/house-owner/house-owner-detail/house-owner-detail.component';
import { HouseOwnerListComponent } from 'src/app/components/manager/person-management/house-owner/house-owner-list/house-owner-list.component';

import { TenantComponent } from 'src/app/components/manager/person-management/tenant/tenant.component';
import { TenantListComponent } from 'src/app/components/manager/person-management/tenant/tenant-list/tenant-list.component';
import { TenantDetailComponent } from 'src/app/components/manager/person-management/tenant/tenant-detail/tenant-detail.component';

// Manager - Section Management Components
import { ApartmentComponent } from 'src/app/components/manager/section-management/apartment/apartment.component';
import { ApartmentDetailComponent } from 'src/app/components/manager/section-management/apartment/apartment-detail/apartment-detail.component';
import { ApartmentListComponent } from 'src/app/components/manager/section-management/apartment/apartment-list/apartment-list.component';

import { FlatComponent } from 'src/app/components/manager/section-management/flat/flat.component';
import { FlatListComponent } from 'src/app/components/manager/section-management/flat/flat-list/flat-list.component';
import { FlatDetailComponent } from 'src/app/components/manager/section-management/flat/flat-detail/flat-detail.component';

import { SectionComponent } from 'src/app/components/manager/section-management/section/section.component';
import { SectionDetailComponent } from 'src/app/components/manager/section-management/section/section-detail/section-detail.component';
import { SectionListComponent } from 'src/app/components/manager/section-management/section/section-list/section-list.component';

import { SectionGroupComponent } from 'src/app/components/manager/section-management/section-group/section-group.component';
import { SectionGroupDetailComponent } from 'src/app/components/manager/section-management/section-group/section-group-detail/section-group-detail.component';
import { SectionGroupListComponent } from 'src/app/components/manager/section-management/section-group/section-group-list/section-group-list.component';

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

  // Manager - General Management
  {
    path: 'manager/general-management/branch', component: BranchComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/general-management/branch-list', component: BranchListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/general-management/branch-detail', component: BranchDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  
  // Manager - Person Management
  {
    path: 'manager/person-management/employee', component: EmployeeComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/employee-list', component: EmployeeListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/employee-detail', component: EmployeeDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/house-owner/:id', component: HouseOwnerComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/house-owner-list', component: HouseOwnerListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/house-owner-detail', component: HouseOwnerDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/tenant', component: TenantComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/tenant-list', component: TenantListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/person-management/tenant-detail', component: TenantDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  
  // Manager - Section Management
  {
    path: 'manager/section-management/section-group', component: SectionGroupComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/section-group-list', component: SectionGroupListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/section-group-detail', component: SectionGroupDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/section', component: SectionComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/section-list', component: SectionListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/section-detail', component: SectionDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/apartment', component: ApartmentComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/apartment-list', component: ApartmentListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/apartment-detail', component: ApartmentDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/flat', component: FlatComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/flat-list', component: FlatListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/section-management/flat-detail', component: FlatDetailComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },

  // Manager - Accounting
  {
    path: 'manager/accounting/account-group', component: AccountGroupComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/accounting/account-group-list', component: AccountGroupListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/accounting/account', component: AccountComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/accounting/account-list', component: AccountListComponent, 
    canActivate: [AuthorizationGuard], data: { roles: ["Manager"] },
  },
  {
    path: 'manager/accounting/account-detail', component: AccountDetailComponent, 
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
