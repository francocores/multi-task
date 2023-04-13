import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserGuard {
  constructor(private nav: NavController) { }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve) => {
      const exist = await StorageService.existUser();

      if (state.url.includes('register') && exist)
        return resolve(this.redirect('home'));

      if (!state.url.includes('register') && !exist)
        return resolve(this.redirect('register'));

      resolve(true);
    });
  }

  private redirect(route: string) {
    this.nav.navigateRoot(route);
    return false;
  }

}
