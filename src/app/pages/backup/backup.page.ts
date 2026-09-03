import { Component, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { ExportService } from 'src/app/services/backup.services/export.service';
import { ImportService } from 'src/app/services/backup.services/import.service';
import { BackupStep } from 'src/app/services/backup.services/models/backupStep';
import { FileService } from 'src/app/services/file.services.common/file.service';

@Component({
    standalone: false,
    selector: 'app-backup',
    templateUrl: './backup.page.html',
    styleUrls: ['./backup.page.scss'],
})
export class BackupPage {
    @ViewChild('inputFile') inputFile!: ElementRef;

    launchBackup = signal<boolean>(false);
    stepProgression = signal<number>(0);
    countStep = signal<number>(0);
    currentStep = signal<BackupStep | null>(null);

    constructor(
        private exportService: ExportService,
        private importService: ImportService, private FileService: FileService) 
    {
        effect( () => {
            const currenStep = this.exportService.currentStep();
            const countStep = this.exportService.countStep();
            const stepProgression = this.exportService.stepProgression();

            this.currentStep.set(currenStep);
            this.countStep.set(countStep);
            this.stepProgression.set(stepProgression);
        });

        effect( () => {          
            const currenStep = this.importService.currentStep();
            const countStep = this.importService.countStep();
            const stepProgression = this.importService.stepProgression();

            this.currentStep.set(currenStep);
            this.countStep.set(countStep);
            this.stepProgression.set(stepProgression);
        });
    }
    
    async export() {  
        this.launchBackup.set(true); 

        await this.exportService.launchExportTCG();

        setTimeout(() => {this.launchBackup.set(false);}, 3000)     
    }

    async import(event: any) {
        this.launchBackup.set(true);
  
        await this.importService.launchImportTCG(event.target.files[0], event.target.files[1]);

        setTimeout(() => {this.launchBackup.set(false);}, 3000)     
    }

    openFileSelector() {
        this.inputFile.nativeElement.click();
    }
}
