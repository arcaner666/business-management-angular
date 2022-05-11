import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { NavGroup } from 'src/app/models/various/nav-group';
import { RouteHistory } from 'src/app/models/various/route-history';

import { AuthorizationService } from 'src/app/services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _emptyRouteHistory: RouteHistory = {
    previousRoute: "",
    accountId: 0,
  };
  private routeHistorySubject: BehaviorSubject<RouteHistory>;
  private sidebarLinksSubject: BehaviorSubject<NavGroup[]>;

  public adminSidebarLinks: NavGroup[] = [
    {
      id: "admin-dashboard",
      title: "Özet",
      url: "admin/admin-dashboard",
      type: "item",
      role: ["Admin"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
  ];
  public companyManagerSidebarLinks: NavGroup[] = [
    {
      id: "company",
      title: "Company Manager",
      url: "",
      type: "",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [
        {
          id: "company",
          title: "Company Manager",
          url: "",
          type: "",
          role: [],
          icon: "",
          disabled: false,
          hidden: false,
        }
      ],
    },
  ];
  public customerSidebarLinks: NavGroup[] = [
    {
      id: "customer-dashboard",
      title: "Özet",
      url: "customer/customer-dashboard",
      type: "item",
      role: ["Customer"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
  ];
  public publicSidebarLinks: NavGroup[] = [
    {
      id: "home",
      title: "Anasayfa",
      url: "public/home",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "about",
      title: "Biz Kimiz?",
      url: "public/about",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "features",
      title: "Ne Sağlıyoruz?",
      url: "public/features",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "references",
      title: "Referanslarımız",
      url: "public/references",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "pricing",
      title: "Paketlerimiz",
      url: "public/pricing",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "contact",
      title: "Bize Ulaşın",
      url: "public/contact",
      type: "item",
      role: [],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
  ];
  public routeHistory$: Observable<RouteHistory>;
  public sectionManagerSidebarLinks: NavGroup[] = [
    {
      id: "manager-dashboard",
      title: "Özet",
      url: "manager/manager-dashboard",
      type: "item",
      role: ["Manager"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [],
    },
    {
      id: "general-management",
      title: "Yönetim",
      url: "",
      type: "collapsible",
      role: ["Manager"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [
        {
          id: "business",
          title: "İşletme",
          url: "manager/general-management/business",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "branch",
          title: "Şubeler",
          url: "manager/general-management/branch",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
      ],
    },
    {
      id: "person-management",
      title: "Kişiler",
      url: "",
      type: "collapsible",
      role: ["Manager"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [
        {
          id: "employee",
          title: "Personeller",
          url: "manager/person-management/employee",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "house-owner",
          title: "Mülk Sahipleri",
          url: "manager/person-management/house-owner",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "tenant",
          title: "Kiracılar",
          url: "manager/person-management/tenant",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
      ],
    },
    {
      id: "section-management",
      title: "Siteler",
      url: "",
      type: "collapsible",
      role: ["Manager"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [
        {
          id: "section-group",
          title: "Site Grupları",
          url: "manager/section-management/section-group",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "section",
          title: "Siteler",
          url: "manager/section-management/section",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "apartment",
          title: "Apartmanlar",
          url: "manager/section-management/apartment",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "flat",
          title: "Daireler",
          url: "manager/section-management/flat",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
      ],
    },
    {
      id: "accounting",
      title: "Muhasebe",
      url: "",
      type: "collapsible",
      role: ["Manager"],
      icon: "",
      disabled: false,
      hidden: false,
      navLinks: [
        {
          id: "account-group",
          title: "Hesap Grupları",
          url: "manager/accounting/account-group",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "account",
          title: "Cari Hesaplar",
          url: "manager/accounting/account",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "cash",
          title: "Kasa",
          url: "manager/accounting/cash",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
        {
          id: "bank",
          title: "Banka",
          url: "manager/accounting/bank",
          type: "item",
          role: ["Manager"],
          icon: "",
          disabled: false,
          hidden: false,
        },
      ],
    },
  ];
  public sidebarLinks$: Observable<NavGroup[]>;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {
    this.sidebarLinksSubject = new BehaviorSubject<NavGroup[]>(this.publicSidebarLinks);
    this.sidebarLinks$ = this.sidebarLinksSubject.asObservable();

    this.routeHistorySubject = new BehaviorSubject<RouteHistory>(cloneDeep(this._emptyRouteHistory));
    this.routeHistory$ = this.routeHistorySubject.asObservable();
  }

  get emptyRouteHistory(): RouteHistory {
    return cloneDeep(this._emptyRouteHistory);
  }

  get routeHistory(): RouteHistory {
    return this.routeHistorySubject.value;
  }

  set routeHistory(routeHistory: RouteHistory){
    this.routeHistorySubject.next(routeHistory);
  }

  get sidebarLinks(): NavGroup[] {
    return this.sidebarLinksSubject.value;
  }

  set sidebarLinks(sidebarLinks: NavGroup[]){
    this.sidebarLinksSubject.next(sidebarLinks);
  }

  loadSidebarLinksByRole(): void {
    if(this.authorizationService.authorizationDto?.role == "Admin"){
      this.sidebarLinks = this.adminSidebarLinks;
    } else if (this.authorizationService.authorizationDto?.role == "Manager") {
      this.sidebarLinks = this.sectionManagerSidebarLinks;
    } else if (this.authorizationService.authorizationDto?.role == "Customer") {
      this.sidebarLinks = this.customerSidebarLinks;
    } else {
      this.sidebarLinks = this.publicSidebarLinks;
    }
  }

  // Role göre kullanıcıyı yönlendir.
  navigateByRole(role: string): void {
    if(role) {
      switch (role) {
        case "Admin": this.router.navigate(['admin/admin-dashboard']); break;
        case "Manager": this.router.navigate(['manager/manager-dashboard']); break;
        case "Customer": this.router.navigate(['customer/customer-dashboard']); break;
        default: this.router.navigate(['/']); break;
      }
    } 
  }
}
