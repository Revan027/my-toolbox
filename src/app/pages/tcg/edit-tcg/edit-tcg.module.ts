import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditTCGPageRoutingModule } from './edit-tcg-routing.module';
import { EditTCGPage } from './edit-tcg.page';
import { TcgDexModalModule } from 'src/app/components/tcg-dex-modal/tcg-dex-modal.module';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, EditTCGPageRoutingModule, ReactiveFormsModule, TcgDexModalModule],
    declarations: [EditTCGPage],
})
export class EditTCGPageModule {}
