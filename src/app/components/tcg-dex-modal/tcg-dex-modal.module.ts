import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TcgDexModalComponent } from './tcg-dex-modal.component';

@NgModule({
    declarations: [TcgDexModalComponent],
    imports: [CommonModule, IonicModule, ReactiveFormsModule],
    exports: [TcgDexModalComponent],
})
export class TcgDexModalModule {}
