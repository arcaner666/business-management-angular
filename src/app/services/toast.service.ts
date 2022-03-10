import { cloneDeep } from 'lodash';
import { Injectable, TemplateRef } from '@angular/core';

import { Toast } from 'src/app/models/various/toast';

const EMPTY_TOAST: Toast = {
  message: "",
  delay: 0,
  classes: "",
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public toasts: Toast[] = [];

  constructor() {

  }

  private show(toast: Toast) {
    this.toasts.push(toast);
  }

  public remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  public success(message: string, delay: number = 5000) {
    let toast: Toast = cloneDeep(EMPTY_TOAST);

    toast.message = message;
    toast.delay = delay;
    toast.classes = "bg-success text-light";

    this.show(toast);
  }

  public danger(message: string, delay: number = 5000) {
    let toast: Toast = cloneDeep(EMPTY_TOAST);

    toast.message = message;
    toast.delay = delay;
    toast.classes = "bg-danger text-light";

    this.show(toast);
  }
}
