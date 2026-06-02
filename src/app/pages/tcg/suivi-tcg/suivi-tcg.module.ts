import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SuiviTCGPageRoutingModule } from './suivi-tcg-routing.module';
import { SuiviTCGPage } from './suivi-tcg.page';
import { CardModule } from 'src/app/components/card/card.module';
import { SortModule } from 'src/app/components/sort/sort.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { DashboardModule } from 'src/app/components/dashboard/dashboard.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SuiviTCGPageRoutingModule,
        CardModule,
        SortModule,
        FilterModule,
        DashboardModule
    ],
    declarations: [SuiviTCGPage],
})
export class SuiviTCGPageModule {}
