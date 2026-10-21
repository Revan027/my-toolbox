import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConvertPage } from './convert.page';
import { ConvertPageRoutingModule } from './convert-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ConvertPageRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [ConvertPage],
})
export class ConvertPageModule {}
