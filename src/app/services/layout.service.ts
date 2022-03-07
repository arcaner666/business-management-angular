import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { LayoutConfig } from 'src/app/models/various/layout-config';

const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  layoutType: "only-content",
  showSidebarFloating: false,
};

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private layoutConfigSubject: BehaviorSubject<LayoutConfig>;

  public layoutConfigObservable: Observable<LayoutConfig>;
  
  constructor() {
    this.layoutConfigSubject = new BehaviorSubject<LayoutConfig>(DEFAULT_LAYOUT_CONFIG);
    this.layoutConfigObservable = this.layoutConfigSubject.asObservable();
  }

  // Layout ayarlarını layout-service'de varsayılana döndürmek için kısayol.
  resetLayoutConfig(): void {
    this.layoutConfigSubject.next(cloneDeep(DEFAULT_LAYOUT_CONFIG));
  }

  // Layout ayarlarını dış component'lerden almak için kısayol.
  get layoutConfig(): LayoutConfig {
    return this.layoutConfigSubject.value;
  }

  // Layout ayarlarını değiştirmek için bir kısayol.
  set layoutConfig(layoutConfig: LayoutConfig){
    this.layoutConfigSubject.next(layoutConfig);
  }

  toggleSidebarFloating() {
    this.layoutConfig.showSidebarFloating = !this.layoutConfig.showSidebarFloating;
  }
}
