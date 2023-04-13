import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static keys = {
    user: 'U_DATA'
  } as const;

  constructor() { }

  static async setUser(user: string) {
    await Preferences.set({
      key: StorageService.keys.user,
      value: user,
    });
  }

  static async getUser() {
    return await Preferences.get({ key: 'name' });
  }

  static async existUser() {
    return !!((await this.getUser()).value)
  }
}
