import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MetricBannerComponent } from './metric-banner.component';

@NgModule({
    declarations: [MetricBannerComponent],
    imports: [CommonModule, IonicModule],
    exports: [MetricBannerComponent],
})
export class MetricBannerModule {}
