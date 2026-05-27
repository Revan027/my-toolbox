import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuiviTCGPageRoutingModule } from './suivi-tcg-routing.module';

import { SuiviTCGPage } from './suivi-tcg.page';
import { CardModule } from 'src/app/components/card/card.module';
import { SortModule } from 'src/app/components/sort/sort.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SuiviTCGPageRoutingModule,
        CardModule,
        SortModule,
    ],
    declarations: [SuiviTCGPage],
})
export class SuiviTCGPageModule {}
