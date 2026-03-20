import { ErrorHandler, inject, NgModule, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoaderComponent } from './components/loader/loader.component';
import { provideHttpClient } from '@angular/common/http';
import { StorageService } from './services/common/storage-service';
import { ErrorService } from './services/common/error.service';
import { Capacitor } from '@capacitor/core';
import { CurrencyPipe } from '@angular/common';
import { FileService } from './services/common/file.service';

@NgModule({
    declarations: [AppComponent, LoaderComponent],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
    exports: [LoaderComponent],
    providers: [
        CurrencyPipe,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: ErrorHandler, useClass: ErrorService },
        provideHttpClient(),
        provideAppInitializer(async () => {
            if (!Capacitor.isNativePlatform()) return;

           // Il faut d'abord faire les injections et ensuite faire le traitement. Sinon on perd le contexte d'injection.
            const fileService = inject(FileService);
            const storageService = inject(StorageService);

            // On init l'uri vers le répertoire Documents qui ne bouchera pas
            await fileService.getDocumentsUri("");

            // On init la base de donné au démarrage de l'application
            await storageService.initPlugin();
        }),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
