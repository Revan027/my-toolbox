import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FilterComponent } from './filter.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [FilterComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    exports: [FilterComponent],
})
export class FilterModule {}
