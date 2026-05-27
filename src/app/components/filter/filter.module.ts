import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FilterComponent } from './filter.component';

@NgModule({
    declarations: [FilterComponent],
    imports: [CommonModule, IonicModule],
    exports: [FilterComponent],
})
export class FilterModule {}
