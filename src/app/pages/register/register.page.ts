import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ValidatorComponent } from "../../shared/validator/validator";
import { ToastService } from 'src/app/core/toast.service';
import { LoadingService } from 'src/app/core/loading.service';
import { StorageService } from 'src/app/core/storage.service';
import { NavService } from 'src/app/core/nav.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorComponent,
  ]
})
export class RegisterPage {
  userName = new FormControl('', { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(25)] });

  constructor(private toast: ToastService, private nav: NavService, private loading: LoadingService) { }

  ionViewWillEnter() {
    this.userName.setValue('');
  }

  async register() {
    this.userName.setValue(this.userName.value?.trim() ?? '');
    this.userName.markAllAsTouched();

    if (this.userName.invalid) {
      await this.toast.show({ msg: 'El campo de texto es invalido, compruebe los mensajes de validación', severity: 'danger' });
    } else {
      await this.loading.show();

      // users love waiting anything ;) (it's a joke, only for simulate a real http call)
      setTimeout(async () => {
        await StorageService.setUser(this.userName.value!);
        await this.loading.hide();

        await this.nav.navigateRoot('home');
      }, 1000);
    }
  }


}
