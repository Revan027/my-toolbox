import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { BackupPage } from './backup.page';
import { BackupPageRoutingModule } from './backup-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BackupPageRoutingModule,
    ],
    declarations: [BackupPage],
})
export class BackupPageModule {}
