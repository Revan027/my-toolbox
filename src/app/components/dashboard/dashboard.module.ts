import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule, ProgressBarModule],
    exports: [DashboardComponent],
})
export class DashboardModule {}
