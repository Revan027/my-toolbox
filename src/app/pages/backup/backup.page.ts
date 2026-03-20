import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { folder } from 'src/app/constants/folder';
import { MessageEnum } from 'src/app/services/common/enum/MessageEnum';
import { StatusEnum } from 'src/app/services/common/enum/status.enum';
import { FileService } from 'src/app/services/common/file.service';
import { StorageService } from 'src/app/services/common/storage-service';
import { ToastService } from 'src/app/services/common/toast.service';
import { CardService } from 'src/app/services/entities/card-service';

@Component({
    standalone: false,
    selector: 'app-backup',
    templateUrl: './backup.page.html',
    styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {
    @ViewChild('inputFile') inputFile!: ElementRef;

    showImportSpinner: boolean = false;
    showExportSpinner: boolean = false;

    constructor(
        private storageService: StorageService, 
        private fileService: FileService,
        private toastService: ToastService,
        private cardService: CardService ) {}

    async ngOnInit() {}

    async export() {
        this.showExportSpinner = true;

        // On exporte la base
        const capSQLiteJson = await this.storageService.exportJson();
  
        // On crée le fichier texte de backup unique avec son contenu en chaine de caractère. Ecriture brut en UTF8
        await this.fileService.writeFile(JSON.stringify(capSQLiteJson.export), `${folder.Backup}/${Date.now()}_backup.txt}`, folder.Backup, Directory.Documents, Encoding.UTF8);

        this.showExportSpinner = false;

        await this.toastService.get(MessageEnum.AppSuccess, StatusEnum.Success);
    }

    async import(event: any) {
        const file: File = event.target.files[0];

        this.showImportSpinner = true;

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
            await Filesystem.writeFile({path: newCard.srcPicture, data: await this.cardService.getPicture(card.id), directory: Directory.Documents});

            // On met jour le nouveau path en base
            await this.cardService.updatePicture(newCard);
        }

        await this.toastService.get("Les fichiers sont importés", StatusEnum.Success);

        this.showImportSpinner = false;
    }

    openFileSelector() {
        this.inputFile.nativeElement.click();
    }
}
