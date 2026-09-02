import { Injectable } from '@angular/core';
import { StorageService } from '../storage.services.common/storage-service';
import { BackupStep } from './models/backupStep';
import { FileService } from '../file.services.common/file.service';
import { folder } from 'src/app/constants/folder';
import { Directory, Encoding } from '@capacitor/filesystem';
import { CapacitorZip } from '@capgo/capacitor-zip';
import { BackupService } from './backupService';

@Injectable({
    providedIn: 'root',
})
export class ExportService extends BackupService {
    constructor(private storageService: StorageService, private fileService: FileService) {
        super();
    }

    private initExportTCG(){
        this.backupSteps = [
            new BackupStep("Exportation des cartes", "Exportation des cartes réussite", "Erreur dans l'exportation des cartes", 1, this.exportDataCards),
            new BackupStep("Exportation du répertoire des images", "Exportation des images réussite", "Erreur dans l'exportation des images", 2, this.exportDirectoryCardImages),
            new BackupStep("Exportation terminée", "", ""),
        ];

        this._countStep.set(this.backupSteps.filter(x => x.stepOrder).length);

        this.resetStepProgression();
    }

    async launchExportTCG(){
        this.initExportTCG();

        for (const backupStep of this.backupSteps) {
            this._currentStep.set(backupStep);

            if(backupStep.action !== undefined){
                await backupStep.action.call(this);// on invoke la méthode depuis le contexte du service pour avoir les injections de dépendance

                this.loadStepProgression();
            } 
        }
    }

    private async exportDataCards(){
        //alert(JSON.stringify(this.storageService, null, 2));
        // On exporte la base
        const capSQLiteJson = await this.storageService.exportJson();
    
        // On crée le fichier texte de backup unique avec son contenu en chaine de caractère. Ecriture brut en UTF8
        await this.fileService.writeFile(JSON.stringify(capSQLiteJson.export), `${Date.now()}_backup.txt`, folder.Backup, Directory.Documents, Encoding.UTF8);
    }

    private async exportDirectoryCardImages(): Promise<void>{
        // Zip du dossier des images
        return CapacitorZip.zip({
            source: this.fileService.getAbsolutePath(await this.fileService.getDocumentsUri(folder.TCG)),
            destination: this.fileService.getAbsolutePath(await this.fileService.getDocumentsUri(`${folder.Backup}/backup.zip`))
        });
    }
}
