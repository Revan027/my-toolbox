import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';
import { MetricBannerModule } from '../metric-banner/metric-banner.module';

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule, ProgressBarModule, MetricBannerModule],
    exports: [DashboardComponent],
})
export class DashboardModule {}
