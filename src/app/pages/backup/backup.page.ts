import { Component, effect, ElementRef, Signal, signal, ViewChild } from '@angular/core';
import { ExportService } from 'src/app/services/backup.services/export.service';
import { ImportService } from 'src/app/services/backup.services/import.service';
import { BackupStep } from 'src/app/services/backup.services/models/backupStep';

@Component({
    standalone: false,
    selector: 'app-backup',
    templateUrl: './backup.page.html',
    styleUrls: ['./backup.page.scss'],
})
export class BackupPage {
    @ViewChild('inputFile') inputFile!: ElementRef;

    launchBackup = signal<boolean>(false);
    stepProgression: Signal<number>;
    countStep: Signal<number>;
    currentStep = signal<BackupStep | null>(null);

    constructor(
        private exportService: ExportService,
        private importService: ImportService) 
    {
        this.stepProgression = this.exportService.stepProgression;
        this.countStep = this.exportService.countStep;

        effect( () => {
            const currenStep = this.exportService.currentStep();

            this.currentStep.set(currenStep);
        });

        effect( () => {
           const currenStep = this.importService.currentStep();

            this.currentStep.set(currenStep);
        });
    }
    
    async export() {  
        this.launchBackup.set(true); 

        await this.exportService.launchExportTCG();

        setTimeout(() => {this.launchBackup.set(false);}, 3000)     
    }

    async import(event: any) {
        this.launchBackup.set(true);

        await this.importService.launchImportTCG(event.target.files[0]);

        setTimeout(() => {this.launchBackup.set(false);}, 3000)     
    }

    openFileSelector() {
        this.inputFile.nativeElement.click();
    }
}
