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

        const capSQLiteJson = await this.storageService.exportJson(),
            json = JSON.stringify(capSQLiteJson.export);
            
        await this.fileService.writeFile(json, `${folder.Backup}/${Date.now()}_backup.txt}`, folder.Backup, Directory.Documents, Encoding.UTF8);

        this.showExportSpinner = false;

        await this.toastService.get(MessageEnum.AppSuccess, StatusEnum.Success);
    }

    async import(event: any) {
        const file: File = event.target.files[0];

        this.showImportSpinner = true;

        await this.storageService.closeDb();

        // On convertit le sjon en objet basique et on met en mode partial pour éviter les soucis de numéro de version de la BD
        const parsed = JSON.parse(await file.text() as string);
        parsed.mode = 'partial';

        await this.storageService.importJson(JSON.stringify(parsed));
        await this.toastService.get("Base importée", StatusEnum.Success);
        await this.storageService.initPlugin();
        var cards = await this.cardService.getAll();

        // On parcours les cartes et on réupload les images
        for (const card of cards) {
            let newCard = card;

            newCard.srcPicture = `${folder.TCG}/${Date.now()}${this.fileService.getExtension(card.srcPicture)}`;
            newCard.id = card.id;

            await Filesystem.writeFile({path: newCard.srcPicture, data: await this.cardService.getPicture(card.id), directory: Directory.Documents});

            await this.cardService.updatePicture(newCard);
        }

        await this.toastService.get("Les fichiers sont uploadé", StatusEnum.Success);

        this.showImportSpinner = false;

        await this.toastService.get(MessageEnum.AppSuccess, StatusEnum.Success);
    }

    openFileSelector() {
        this.inputFile.nativeElement.click();
    }
}
