import { Component } from '@angular/core';
import { App } from '@capacitor/app';

@Component({
    selector: 'app-tcg-menu',
    templateUrl: './tcg-menu.component.html',
    styleUrls: ['./tcg-menu.component.scss'],
    standalone: false,
})
export class TcgMenuComponent {
    numVersion!: string;
    
    constructor() {}

    async ngOnInit() {
       const info = await App.getInfo();

       this.numVersion = info.version;
    }
}
