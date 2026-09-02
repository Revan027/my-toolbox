import { Component, ElementRef, Signal, signal, ViewChild } from '@angular/core';
import { folder } from 'src/app/constants/folder';
import { ExportService } from 'src/app/services/backup.services/export.service';
import { BackupStep } from 'src/app/services/backup.services/models/backupStep';
import { CardService } from 'src/app/services/card.service';
import { FileService } from 'src/app/services/file.services.common/file.service';
import { StatusEnum } from 'src/app/services/services.common/enum/status.enum';
import { ToastService } from 'src/app/services/services.common/toast.service';
import { StorageService } from 'src/app/services/storage.services.common/storage-service';

@Component({
    standalone: false,
    selector: 'app-backup',
    templateUrl: './backup.page.html',
    styleUrls: ['./backup.page.scss'],
})
export class BackupPage {
    @ViewChild('inputFile') inputFile!: ElementRef;

    launchStep = signal<boolean>(false);
    stepProgression: Signal<number>;
    countStep: Signal<number>;
    currentStep: Signal<BackupStep | null>;

    constructor(
        private storageService: StorageService, 
        private fileService: FileService,
        private toastService: ToastService,
        private cardService: CardService,
        private exportService: ExportService) 
    {
        this.stepProgression = this.exportService.stepProgression;
        this.currentStep = this.exportService.currentStep;
        this.countStep = this.exportService.countStep;
    }
    
    async export() {  
        this.launchStep.set(true);

        await this.exportService.launchImportTCG();

        setTimeout(() => {this.launchStep.set(false);}, 3000)     
    }

    async import(event: any) {
        // méthode récurisive qui va lire chauqe fichier de backup itéré par le nom et incrémenté. Chaque ietration insère et en base et créer lers images sur le téléphone
        const file: File = event.target.files[0];

        // On ferme la base
        await this.storageService.closeDb();

        // On convertit le JSON en objet basique et on met en mode partial pour éviter les soucis de numéro de version de la BD
        const parsed = JSON.parse(await file.text() as string);
        parsed.mode = 'partial';

        // On lance l'import avec la chaine de JSON
        await this.storageService.importJson(JSON.stringify(parsed));
        await this.toastService.get("Base importée", StatusEnum.Success);

        // On relance la base
        await this.storageService.initPlugin();

        // On parcours les cartes
        var cards = await this.cardService.getAll();

        for (const card of cards) {
            let newCard = card;

            newCard.srcPicture = `${folder.TCG}/${Date.now()}${this.fileService.getExtension(card.srcPicture)}`;
            newCard.id = card.id;

            // On upload l'image sous un nouveau nom
            //await Filesystem.writeFile({path: newCard.srcPicture, data: await this.cardService.getPicture(card.id), directory: Directory.Documents});

            // On met jour le nouveau path en base
            await this.cardService.updatePicture(newCard);
        }

        await this.toastService.get("Les fichiers sont importés", StatusEnum.Success);

    }

    openFileSelector() {
        this.inputFile.nativeElement.click();
    }
}
