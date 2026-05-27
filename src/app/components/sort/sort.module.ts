import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SortComponent } from './sort.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [SortComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    exports: [SortComponent],
})
export class SortModule {}
