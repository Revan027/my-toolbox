import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    exports: [DashboardComponent],
})
export class DashboardModule {}
