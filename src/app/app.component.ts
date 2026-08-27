import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false,
})
export class AppComponent {
    constructor(private router: Router) {
        if (Capacitor.isNativePlatform()) {
            // Style.Light = fond clair → icônes SOMBRES (contre-intuitif)
            StatusBar.setStyle({ style: Style.Light });
        }

        this.router.navigateByUrl("/loading")
      }
}
