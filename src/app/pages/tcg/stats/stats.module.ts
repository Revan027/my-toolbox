import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StatsPage } from './stats.page';
import { StatsPageRoutingModule } from './stats-routing.module';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ProgressBarModule } from 'src/app/components/progress-bar/progress-bar.module';
import { MetricBannerModule } from 'src/app/components/metric-banner/metric-banner.module';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        StatsPageRoutingModule,
        NgxEchartsDirective,     
        NgxEchartsModule.forRoot({ echarts }),
        ProgressBarModule,
        MetricBannerModule,
    ],
    declarations: [StatsPage],
})
export class StatsPageModule {}
