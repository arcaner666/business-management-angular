import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { LayoutConfig } from 'src/app/models/various/layout-config';

const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  showNavbar: true,
  showSidebar: false,
  showFooter: true,
};

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private layoutConfigSubject: BehaviorSubject<LayoutConfig>;

  public layoutConfigObservable: Observable<LayoutConfig>;
  
  constructor() {
    if (!JSON.parse(localStorage.getItem('layoutConfig')!)) {
      localStorage.setItem('layoutConfig', JSON.stringify(cloneDeep(DEFAULT_LAYOUT_CONFIG)));
    }
    this.layoutConfigSubject = new BehaviorSubject<LayoutConfig>(JSON.parse(localStorage.getItem('layoutConfig')!));
    this.layoutConfigObservable = this.layoutConfigSubject.asObservable();
  }

  // Layout ayarlarını localStorage'dan ve layout-service'den silmek için kısayol.
  clearLayoutConfig(): void {
    localStorage.removeItem('layoutConfig');
    this.layoutConfigSubject.next(cloneDeep(DEFAULT_LAYOUT_CONFIG));
  }

  // Boş layout ayarlarını dış component'lerden almak için kısayol.
  get emptyLayoutConfig(): LayoutConfig {
    return cloneDeep(DEFAULT_LAYOUT_CONFIG);
  }

  // Layout ayarlarını dış component'lerden almak için kısayol.
  get layoutConfig(): LayoutConfig {
    return this.layoutConfigSubject.value;
  }

  // Layout ayarlarını değiştirmek için bir kısayol.
  set layoutConfig(layoutConfig: LayoutConfig){
    localStorage.setItem("layoutConfig", JSON.stringify(layoutConfig));
    this.layoutConfigSubject.next(layoutConfig);
  }
}
