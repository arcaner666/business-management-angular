import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { ScreenSize } from 'src/app/models/various/screen-size';

const EMPTY_SCREEN_SIZE: ScreenSize = {
  width: 0,
  height: 0,
};

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  private screenSizeSubject: BehaviorSubject<ScreenSize>;

  public screenSizeObservable: Observable<ScreenSize>;

  constructor() {
    this.screenSizeSubject = new BehaviorSubject<ScreenSize>(cloneDeep(EMPTY_SCREEN_SIZE));
    this.screenSizeObservable = this.screenSizeSubject.asObservable();
  }

  // Ekran boyutlarını dış component'lerden almak için kısayol.
  get screenSize(): ScreenSize {
    return this.screenSizeSubject.value;
  }

  // Ekran boyutlarını değiştirmek için bir kısayol.
  set screenSize(screenSize: ScreenSize){
    this.screenSizeSubject.next(screenSize);
  }

  // Belirli bir ekran boyutunu kapsar. ---------------------------------------------------------------------------------
  isScreenXSmall(): boolean {
    if (this.screenSize.width < 576) {
      return true;
    }
    return false;
  }

  isScreenSmall(): boolean {
    if (this.screenSize.width >= 576 && this.screenSize.width < 768) {
      return true;
    }
    return false;
  }

  isScreenMedium(): boolean {
    if (this.screenSize.width >= 768 && this.screenSize.width < 992) {
      return true;
    }
    return false;
  }

  isScreenLarge(): boolean {
    if (this.screenSize.width >= 992 && this.screenSize.width < 1200) {
      return true;
    }
    return false;
  }

  isScreenXLarge(): boolean {
    if (this.screenSize.width >= 1200 && this.screenSize.width < 1400) {
      return true;
    }
    return false;
  }

  isScreenXXLarge(): boolean {
    if (this.screenSize.width >= 1400) {
      return true;
    }
    return false;
  }
}
