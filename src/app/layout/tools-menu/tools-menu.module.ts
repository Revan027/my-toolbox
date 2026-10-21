import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsMenuComponent } from './tools-menu.component';
import { ToolsMenuRoutingModule } from './tools-menu-routing.module';

@NgModule({
    imports: [IonicModule, CommonModule, ToolsMenuRoutingModule],
    declarations: [ToolsMenuComponent],
})
export class ToolsMenuModule {}
