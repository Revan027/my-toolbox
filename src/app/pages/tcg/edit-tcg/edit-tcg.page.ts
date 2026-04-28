import { Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { folder } from 'src/app/constants/folder';
import { Card } from 'src/app/models/Card';
import { Generation } from 'src/app/models/Generation';
import { Serie } from 'src/app/models/Serie';
import { CardService } from 'src/app/services/entities/card-service';
import { GenerationService } from 'src/app/services/entities/generation-service';
import { SerieService } from 'src/app/services/entities/serie-service';
import { FileService } from 'src/app/services/file.services.common/file.service';
import { MediaService } from 'src/app/services/media.services.common/media.service';
import { AmountService } from 'src/app/services/services.common/amount.service';
import { ConfirmationService } from 'src/app/services/services.common/confirmation.service';
import { MessageEnum } from 'src/app/services/services.common/enum/MessageEnum';
import { StatusEnum } from 'src/app/services/services.common/enum/status.enum';
import { ToastService } from 'src/app/services/services.common/toast.service';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit-tcg.page.html',
    styleUrls: ['./edit-tcg.page.scss'],
})
export class EditTCGPage implements OnDestroy {
    private destroyRef = inject(DestroyRef);
    @ViewChild('inputFile') inputFile!: ElementRef;

    formGroup!: FormGroup;
    card: Card = new Card();

    generations: Generation[] = [];
    series: Serie[] = [];

    private debounceTimer: any;
    lastSrcPicture: string = "";
    loaded: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private fileService: FileService,
        private mediaService: MediaService,
        private formBuilder: FormBuilder,
        private amountService: AmountService,
        private serieService: SerieService,
        private cardService: CardService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private generationService: GenerationService
    ) { }

    //on évite ainsi avec ce lifecycle de faire ramer avec l'animation
    async ionViewDidEnter() { 

        this.generations = await this.generationService.getAll();
        this.series = await this.serieService.getAll();

        // Ecoute de l'event si l'url change. On ne repasse pas 2 fois dans un ngOnInit normalement
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
            this.loaded = false;

            const id = Number(params.get('id'));

            if (Capacitor.isNativePlatform() && id){
                this.card = await this.cardService.getById(id);
                this.lastSrcPicture = this.card.srcPicture;
            }

            this.createForm();
         
            this.loaded = true;
        });

    }

    ngOnDestroy() {
        clearTimeout(this.debounceTimer);
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            id: [this.card?.id],
            name: [this.card?.name, Validators.compose([Validators.required])],
            srcPicture: [this.card?.srcPicture, Validators.required],
            averagePrice: [ { value: this.card?.averagePrice == 0 ? "" : this.card?.averagePrice, disabled: false } , null],
            isPriority: [ { value: this.card?.isPriority, disabled: false } , null],
            isAcquired: [ { value: this.card?.isAcquired, disabled: false } , null],
            serieID: [this.card?.serieID, Validators.required],
            generationID: [this.card?.generationID, Validators.required],
            picture: [this.card?.picture, Validators.required],
        });
    }

    getSrc(path: string){
       return this.fileService.getSrcWeb(this.fileService.getAbsolutePath(this.fileService.documentsUri(), path));
    }

    getPath(fileName: string){
        return `${folder.TCG}/${fileName}`;
    }

    getFormatAmountInput(event: CustomEvent) {
        clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
            this.amountService.formatAmountInput("averagePrice", event.detail.value, this.formGroup);      
        }, 800);
    }

    private async deleteLastFile(){
        if (this.lastSrcPicture){
            await this.fileService.deleteFile(this.lastSrcPicture);
        }
    }

    async onSubmit(card: Card) {
        let result = this.card.id > 0 ? await this.cardService.update(card) : await this.cardService.create(card),
        isSuccess = (result.changes?.changes ?? 0) > 0;

        await this.toastService.get(isSuccess ? MessageEnum.AppSuccess : MessageEnum.AppError, isSuccess ? StatusEnum.Success : StatusEnum.Danger);

        if(this.card.id == 0){
            this.createForm();

            // On reset les éléments dynamique
            this.lastSrcPicture = "";

            this.card = new Card();
        } 
    }

    async onDelete() {
        var me = this;

        let callback = async function(){
            let result = await me.cardService.delete(me.card.id),
                isSuccess = (result.changes?.changes ?? 0) > 0;

                if (isSuccess)  me.deleteLastFile();

                await me.toastService.get(isSuccess ? MessageEnum.AppSuccess : MessageEnum.AppError, isSuccess ? StatusEnum.Success : StatusEnum.Danger);
                
                me.router.navigate(['/tcg']);
        }

        await this.confirmationService.getModalDelete(callback);
        
        this.createForm();
    }

    async onCapturePhoto(event: Event) {
        const photo = await this.mediaService.takePhoto(),
            fileName = this.fileService.getFileName(photo),
            path = this.getPath(fileName);

        this.deleteLastFile();

        const result = await this.fileService.writeFile(
            photo.base64String!,
            fileName,
            folder.TCG
        );

        this.formGroup.get("srcPicture")?.setValue(path, { emitEvent: false },);
        this.formGroup.get("picture")?.setValue(photo.base64String, { emitEvent: false },);

        this.lastSrcPicture = path;
    }

    onFileSelector(event: Event) {
        this.inputFile.nativeElement.click();
    }

    async onFileChanged(event: any) {
        const file: File = event.target.files[0],
            fileName = this.fileService.getFileName(file),
            path = this.getPath(fileName);

       this.deleteLastFile();
        
        const result = await this.fileService.saveFile(file, fileName, folder.TCG);

        // On save l'uri où est stocké l'image dans le champ caché
        this.formGroup.get("srcPicture")?.setValue(path, { emitEvent: false },);
        this.formGroup.get("picture")?.setValue(await this.fileService.fileToBase64(file), { emitEvent: false },);

        this.lastSrcPicture = path;

        /*-- TEST base 64--*/
        // On lit le fichier image en base 64
        //const stream = await this.fileService.readFile(path);

        // On set la preview
        //const testSrc64 =`data:${file.type};base64,${stream.data}`;
    }

    async onSerieChanged(event: CustomEvent) {
       this.card.serie.srcLogo = this.series.find((serie)=> serie.id == event.detail.value)?.srcLogo || "";
    }
}
