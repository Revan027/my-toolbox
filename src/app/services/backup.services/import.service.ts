import { Injectable } from '@angular/core';
import { StorageService } from '../storage.services.common/storage-service';
import { BackupStep } from './models/backupStep';
import { BackupService } from './backupService';
import { FileService } from '../file.services.common/file.service';
import { folder } from 'src/app/constants/folder';
import { CapacitorZip } from '@capgo/capacitor-zip';

@Injectable({
    providedIn: 'root',
})
export class ImportService extends BackupService {

    private jsonFile!: File;
    private zipFile!: File;

    constructor(private storageService: StorageService, private fileService: FileService) {
        super();
    }

    private initExportTCG(jsonFile: File){
        this.jsonFile = jsonFile;

        this.backupSteps = [
            new BackupStep("Importation des cartes", "Importation des cartes réussite", "Erreur dans l'importation des cartes", 1, this.inportDataCards),
            new BackupStep("Importation du répertoire des images", "Importation des images réussite", "Erreur dans l'importation des images", 2, this.importDirectoryCardImages),
            new BackupStep("Importation terminée", "", ""),
        ];

        this._countStep.set(this.backupSteps.filter(x => x.stepOrder).length);

        this.resetStepProgression();
    }

    async launchImportTCG(jsonFile: File){
        this.initExportTCG(jsonFile);

        for (const backupStep of this.backupSteps) {
            this._currentStep.set(backupStep);

            if(backupStep.action !== undefined){
                await backupStep.action.call(this);// on invoke la méthode depuis le contexte du service pour avoir les injections de dépendance

                this.loadStepProgression();
            } 
        }
    }

    private async inportDataCards(){
        // On ferme la base
        await this.storageService.closeDb();

        // On convertit le JSON en objet basique et on met en mode partial pour éviter les soucis de numéro de version de la BD
        const parsed = JSON.parse(await this.jsonFile.text() as string);
        parsed.mode = 'partial';

        // On lance l'import avec la chaine de JSON
        await this.storageService.importJson(JSON.stringify(parsed));

        // On relance la base
        await this.storageService.initPlugin();
    }

    private async importDirectoryCardImages(){
        return CapacitorZip.unzip({
            source: this.fileService.getAbsolutePath(await this.fileService.getDocumentsUri(`${folder.Backup}/backup.zip`)),
            destination: this.fileService.getAbsolutePath(await this.fileService.getDocumentsUri(`${folder.TCG}`))
        });
    }
}
