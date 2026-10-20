import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StatsPage } from './stats.page';
import { StatsPageRoutingModule } from './stats-routing.module';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ProgressBarModule } from 'src/app/components/progress-bar/progress-bar.module';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        StatsPageRoutingModule,
        NgxEchartsDirective,     
        NgxEchartsModule.forRoot({ echarts }),
        ProgressBarModule
    ],
    declarations: [StatsPage],
})
export class StatsPageModule {}
