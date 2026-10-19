import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TcgMenuComponent } from './tcg-menu.component';
import { TcgMenuRoutingModule } from './tcg-menu-routing.module';

@NgModule({
    imports: [IonicModule, CommonModule, TcgMenuRoutingModule],
    declarations: [TcgMenuComponent],
})
export class TcgMenuModule {}
