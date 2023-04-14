import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { Task } from 'src/app/data/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {
  title = 'Lista de tareas' as const;
  tasks: Task[] = [];

  constructor(private actionSheetCtrl: ActionSheetController) {
    // MOCK
    const users = ['Juan', 'Pedro', 'Jean'];
    const status = [0, 1];
    const descriptions = [
      `Lorem ipsum dolor sit amet, sed do ipsum consectet me sed
      adipiscing. Lorem ipsum dolor sit amet, sed do ipsum Lorem
      consectetuer adipiscing.`,
      `Lorem ipsum dolor sit amet, sed do ipsum consectet me sed
      adipiscing. Lorem ipsum dolor sit amet, sed do ipsum Lorem
      consectetuer adipiscing.
      Lorem ipsum dolor sit amet, sed do ipsum consectet me sed
      adipiscing. Lorem ipsum dolor sit amet, sed do ipsum Lorem
      consectetuer adipiscing.`,
    ];

    for (let index = 0; index < 20; index++) {
      this.tasks.push({
        id: 0,
        user: users[Math.floor(Math.random() * users.length)],
        status: status[Math.floor(Math.random() * status.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        created_at: new Date(),
      });
    }
  }

  colorItem(index: number) {
    return this.evenNumber(index) ? 'light' : 'medium';
  }

  evenNumber(index: number) {
    return index % 2 === 0;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Acciones',
      buttons: [
        {
          text: 'Eliminar tarea',
          role: 'destructive',
          data: {
            action: 'delete'
          }
        },
        {
          text: 'Completar tarea',
          data: {
            action: 'share'
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          data: {
            action: 'cancel'
          }
        }
      ],
    });

    await actionSheet.present();
  }
}
