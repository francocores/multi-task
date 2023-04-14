import { LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

registerLocaleData(es);

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    importProvidersFrom(
      IonicModule.forRoot({ mode: 'ios' }),
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireStorageModule,
      AngularFireDatabaseModule,
      AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideDatabase(() => getDatabase()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
    ),
    provideRouter(routes),
  ],
});
