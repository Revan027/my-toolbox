import { Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { folder } from 'src/app/constants/folder';
import { Card } from 'src/app/models/Card';
import { Generation } from 'src/app/models/Generation';
import { Serie } from 'src/app/models/Serie';
import { AmountService } from 'src/app/services/common/amount.service';
import { ConfirmationService } from 'src/app/services/common/confirmation.service';
import { MessageEnum } from 'src/app/services/common/enum/MessageEnum';
import { StatusEnum } from 'src/app/services/common/enum/status.enum';
import { FileService } from 'src/app/services/common/file.service';
import { MediaService } from 'src/app/services/common/media.service';
import { ToastService } from 'src/app/services/common/toast.service';
import { CardService } from 'src/app/services/entities/card-service';
import { GenerationService } from 'src/app/services/entities/generation-service';
import { SerieService } from 'src/app/services/entities/serie-service';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit-tcg.page.html',
    styleUrls: ['./edit-tcg.page.scss'],
})
export class EditTCGPage implements OnInit, OnDestroy {
    private destroyRef = inject(DestroyRef);
    @ViewChild('inputFile') inputFile!: ElementRef;

    formGroup!: FormGroup;
    card!: Card;

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
    ) {}

    async ngOnInit() {
        this.generations = await this.generationService.getAll();

        // Ecoute de l'event si l'url change. On ne repasse pas 2 fois dans un ngOnInit normalement
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
            const id = Number(params.get('id'));

            if(Capacitor.isNativePlatform()){
                this.card = id ? await this.cardService.getById(id) : new Card();
                this.lastSrcPicture = this.card.srcPicture;
            }
            else{
                this.card = new Card();
            }

            this.createForm();
         
            this.series = await this.serieService.getAll();
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

    async submit(card: Card) {
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

    async delete() {
        var me = this;

        let callback = async function(){
            let result = await me.cardService.delete(me.card.id),
                isSuccess = (result.changes?.changes ?? 0) > 0;

                await me.toastService.get(isSuccess ? MessageEnum.AppSuccess : MessageEnum.AppError, isSuccess ? StatusEnum.Success : StatusEnum.Danger);
                
                me.router.navigate(['/tcg']);
        }

        await this.confirmationService.getModalDelete(callback);
        
        this.createForm();
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

    async capturePhoto(event: Event) {
        const photo = await this.mediaService.takePhoto(),
            fileName = this.fileService.getFileName(photo),
            path = this.getPath(fileName);

        const result = await this.fileService.writeFile(
            photo.base64String!,
            fileName,
            folder.TCG
        );

        this.formGroup.get("srcPicture")?.setValue(path, { emitEvent: false },);

        this.formGroup.get("picture")?.setValue(photo.base64String, { emitEvent: false },);

        this.lastSrcPicture = path;
    }

    openFileSelector(event: Event) {
        this.inputFile.nativeElement.click();
    }

    async handleFileChanged(event: any) {
        const file: File = event.target.files[0],
            fileName = this.fileService.getFileName(file),
            path = this.getPath(fileName);

        if (this.lastSrcPicture){
            await this.fileService.deleteFile(this.lastSrcPicture);
        }
        
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

    async serieChanged(event: CustomEvent) {
       this.card.serie.srcLogo = this.series.find((serie)=> serie.id == event.detail.value)?.srcLogo || "";
    }
}
