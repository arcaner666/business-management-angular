import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { NavGroup } from 'src/app/models/various/nav-group';
import { NavLink } from 'src/app/models/various/nav-link';

import { AuthorizationService } from 'src/app/services/authorization.service';

const PUBLIC_NAVBAR_LINKS: NavLink[] = [
  {
    id: 0,
    title: "Anasayfa",
    url: "public/home",
    type: "item",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
  },
  {
    id: 1,
    title: "Biz Kimiz?",
    url: "public/about",
    type: "item",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
  },
  {
    id: 2,
    title: "Ne Sağlıyoruz?",
    url: "public/features",
    type: "item",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
  },
  {
    id: 3,
    title: "Referanslarımız",
    url: "public/references",
    type: "item",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
  },
  {
    id: 4,
    title: "Paketlerimiz",
    url: "public/pricing",
    type: "item",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
  },
  {
    id: 5,
    title: "Bize Ulaşın",
    url: "public/contact",
    type: "item",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
  },
];

const SECTION_MANAGER_SIDEBAR_LINKS: NavGroup[] = [
  {
    id: 10,
    title: "Section Manager",
    url: "",
    type: "",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
    navLinks: [
      {
        id: 11,
        title: "Section Manager",
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

const COMPANY_MANAGER_SIDEBAR_LINKS: NavGroup[] = [
  {
    id: 10,
    title: "Company Manager",
    url: "",
    type: "",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
    navLinks: [
      {
        id: 11,
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

const ADMIN_SIDEBAR_LINKS: NavGroup[] = [
  {
    id: 10,
    title: "Admin",
    url: "",
    type: "",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
    navLinks: [
      {
        id: 11,
        title: "Admin",
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

const CUSTOMER_SIDEBAR_LINKS: NavGroup[] = [
  {
    id: 10,
    title: "Customer",
    url: "",
    type: "",
    role: [],
    icon: "",
    disabled: false,
    hidden: false,
    navLinks: [
      {
        id: 11,
        title: "Customer",
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

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private navbarLinksSubject: BehaviorSubject<NavLink[]>;
  private sidebarLinksSubject: BehaviorSubject<NavGroup[]>;

  public adminSidebarLinks: NavGroup[] = ADMIN_SIDEBAR_LINKS;
  public companyManagerSidebarLinks: NavGroup[] = COMPANY_MANAGER_SIDEBAR_LINKS;
  public customerSidebarLinks: NavGroup[] = CUSTOMER_SIDEBAR_LINKS;
  public navbarLinks$: Observable<NavLink[]>;
  public publicNavbarLinks: NavLink[] = PUBLIC_NAVBAR_LINKS;
  public sectionManagerSidebarLinks: NavGroup[] = SECTION_MANAGER_SIDEBAR_LINKS;
  public sidebarLinks$: Observable<NavGroup[]>;

  constructor(
    private _authorizationService: AuthorizationService,
    private _router: Router
  ) {
    this.navbarLinksSubject = new BehaviorSubject<NavLink[]>(PUBLIC_NAVBAR_LINKS);
    this.sidebarLinksSubject = new BehaviorSubject<NavGroup[]>(SECTION_MANAGER_SIDEBAR_LINKS);
    this.navbarLinks$ = this.navbarLinksSubject.asObservable();
    this.sidebarLinks$ = this.sidebarLinksSubject.asObservable();
  }

  get navbarLinks(): NavLink[] {
    return this.navbarLinksSubject.value;
  }

  set navbarLinks(navbarLinks: NavLink[]){
    this.navbarLinksSubject.next(navbarLinks);
  }

  get sidebarLinks(): NavGroup[] {
    return this.sidebarLinksSubject.value;
  }

  set sidebarLinks(sidebarLinks: NavGroup[]){
    this.sidebarLinksSubject.next(sidebarLinks);
  }

  loadNavbarLinksByRole() {
    if(!this._authorizationService.authorizationDto?.role){
      this.navbarLinks = this.publicNavbarLinks;
    } else {
      this.navbarLinks = [];
    }
  }

  loadSidebarLinksByRole() {
    if(this._authorizationService.authorizationDto?.role == "Admin"){
      this.sidebarLinks = this.adminSidebarLinks;
    } else if (this._authorizationService.authorizationDto?.role == "Manager") {
      this.sidebarLinks = this.sectionManagerSidebarLinks;
    } else if (this._authorizationService.authorizationDto?.role == "Customer") {
      this.sidebarLinks = this.customerSidebarLinks;
    }
  }

  // Role göre kullanıcıyı yönlendir.
  navigateByRole(role: string) {
    if(role) {
      switch (role) {
        case "Admin": this._router.navigate(['admin/admin-dashboard']); break;
        case "Manager": this._router.navigate(['manager/manager-dashboard']); break;
        case "Customer": this._router.navigate(['customer/customer-dashboard']); break;
        default: this._router.navigate(['/']); break;
      }
    } 
  }
}
