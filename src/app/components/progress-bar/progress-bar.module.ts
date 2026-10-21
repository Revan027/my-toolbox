import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './progress-bar.component';

@NgModule({
    declarations: [ProgressBarComponent],
    imports: [CommonModule, IonicModule],
    exports: [ProgressBarComponent],
})
export class ProgressBarModule {}
