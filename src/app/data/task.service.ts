import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { StorageService } from '../core/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private keys = {
    tasks: 'TASKS'
  } as const;

  private tasksRef: AngularFireList<Task>;

  constructor(private db: AngularFireDatabase) {
    this.tasksRef = db.list(this.keys.tasks);
  }

  async store(description: string) {
    const tasks = this.db.list(`${this.keys.tasks}`);

    return tasks.push({
      created_at: new Date().toISOString(),
      description: description,
      user: (await StorageService.getUser()).value,
      status: 0,
    });
  }

  getAll(): AngularFireList<Task> {
    return this.tasksRef;
  }

  updateStatus(key: string) {
    return this.tasksRef.update(key, { status: 1 });
  }

  delete(key: string): Promise<void> {
    return this.tasksRef.remove(key);
  }

}
