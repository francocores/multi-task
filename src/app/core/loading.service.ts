import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private loading: HTMLIonLoadingElement | undefined;

    constructor(private loadingCtrl: LoadingController) { }

    public async show() {
        const loading = await this.loadingCtrl.create({
        });
        await loading.present();

        this.loading = loading;
        return loading;
    }

    public async hide() {
        if (this.loading)
            await this.loading.dismiss();
    }

}