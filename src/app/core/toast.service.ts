import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: ToastController) {}

  public async show(config: {
    msg: string;
    detail?: any;
    severity?:
      | 'success'
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'warning'
      | 'danger'
      | 'light'
      | 'medium';
    duration?: number;
  }) {
    const toast = await this.toast.create({
      header: config.msg,
      message: config.detail,
      color: config.severity || 'success',
      duration: config.duration || 3000,
      position: 'top',
    });
    await toast.present();
    return toast;
  }
}
