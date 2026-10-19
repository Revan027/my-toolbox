import { Component } from '@angular/core';
import { App } from '@capacitor/app';

@Component({
    selector: 'app-tools-menu',
    templateUrl: './tools-menu.component.html',
    styleUrls: ['./tools-menu.component.scss'],
    standalone: false,
})
export class ToolsMenuComponent {
    numVersion!: string;
    
    constructor() {}

    async ngOnInit() {
       const info = await App.getInfo();

       this.numVersion = info.version;
    }
}
