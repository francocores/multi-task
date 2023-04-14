import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionSheetButton, ActionSheetController, IonModal, IonicModule } from '@ionic/angular';
import { LoadingService } from 'src/app/core/loading.service';
import { ToastService } from 'src/app/core/toast.service';
import { Task } from 'src/app/data/task.model';
import { ValidatorComponent } from 'src/app/shared/validator/validator';
import { TaskService } from 'src/app/data/task.service';
import { map } from 'rxjs';
import { FilterPipe } from 'src/app/utils/filter.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidatorComponent,
    FilterPipe
  ],
})
export class HomePage {
  @ViewChild(IonModal) modal!: IonModal;

  search = new FormControl('');
  taskDescription = new FormControl('', { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(255)] });

  title = 'Lista de tareas' as const;
  tasks: Task[] = [];

  constructor(
    private toast: ToastService,
    private loading: LoadingService,
    private actionSheetCtrl: ActionSheetController,
    private taskService: TaskService,
  ) {
  }

  async ionViewDidEnter() {
    this.search.reset();

    await this.loading.show();
    this.taskService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      ),
    ).subscribe({
      next:
        (items) => {
          this.loading.hide();
          this.tasks = items as Task[];
        },
      error: () => this.loading.hide(),
    });
  }

  filterTasks(task: Task, search: string | null) {
    if (!search) return true;

    search = search.toLowerCase();
    return task.user!.toLowerCase().includes(search)
      || task.description!.toLowerCase().includes(search)
      || task.created_at!.toString()?.toLowerCase().includes(search);
  }

  colorItem(index: number) {
    return this.evenNumber(index) ? 'light' : 'medium';
  }

  evenNumber(index: number) {
    return index % 2 === 0;
  }

  async presentActionSheet(task: Task) {
    const buttons: (string | ActionSheetButton<any>)[] = [
      {
        text: 'Eliminar tarea',
        role: 'destructive',
        data: {
          action: 'delete'
        },
        handler: () => this.deleteTask(task)
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        data: {
          action: 'cancel'
        }
      }
    ];

    if (!task.status)
      buttons.push({
        text: 'Completar tarea',
        data: {
          action: 'share'
        },
        handler: () => this.updateTask(task)
      });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: buttons,
    });

    await actionSheet.present();
  }

  async updateTask(task: Task) {
    await this.loading.show();
    this.taskService.updateStatus(task.key!).then(async () => {
      await this.loading.hide();
      await this.toast.show({ msg: 'Se ha marcado la tarea como completada' });
    }).catch(async () => {
      await this.loading.hide();
      await this.toast.show({ msg: 'La tarea no se pudo marcar como completada', severity: 'danger' });
    })
  }

  async deleteTask(task: Task) {
    await this.loading.show();
    this.taskService.delete(task.key!).then(async () => {
      await this.loading.hide();
      await this.toast.show({ msg: 'Tarea eliminada correctamente' });
    }).catch(async () => {
      await this.loading.hide();
      await this.toast.show({ msg: 'La tarea no se pudo eliminar', severity: 'danger' });
    })
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async confirm() {
    this.taskDescription.setValue(this.taskDescription.value?.trim() ?? '');
    this.taskDescription.markAllAsTouched();

    if (this.taskDescription.invalid) {
      await this.toast.show({ msg: 'El campo de texto es invalido, compruebe los mensajes de validación', severity: 'danger' });
    } else {
      await this.loading.show();

      this.taskService.store(this.taskDescription.value!).then(async () => {
        await this.loading.hide();
        await this.toast.show({ msg: 'Tarea registrada correctamente' });
        await this.modal.dismiss(this.taskDescription.value, 'confirm');
      }).catch(async () => {
        await this.loading.hide();
        await this.toast.show({ msg: 'La tarea no se pudo registrar', severity: 'danger' });
      })
    }
  }
}
