import { Component, DestroyRef, ElementRef, inject, OnDestroy, signal, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { folder } from 'src/app/constants/folder';
import { Card } from 'src/app/models/Card';
import { Generation } from 'src/app/models/Generation';
import { CardCondition } from 'src/app/models/CardCondition';
import { Serie } from 'src/app/models/Serie';
import { CardService } from 'src/app/services/card.service';
import { GenerationService } from 'src/app/services/generation.service';
import { CardConditionService } from 'src/app/services/card-condition.service';
import { SerieService } from 'src/app/services/serie.service';
import { FileService } from 'src/app/services/file.services.common/file.service';
import { MediaService } from 'src/app/services/media.services.common/media.service';
import { ConfirmationService } from 'src/app/services/services.common/confirmation.service';
import { MessageEnum } from 'src/app/services/services.common/enum/MessageEnum';
import { StatusEnum } from 'src/app/services/services.common/enum/status.enum';
import { ToastService } from 'src/app/services/services.common/toast.service';
import { Location } from '@angular/common';

@Component({
    standalone: false,
    selector: 'app-edit',
    templateUrl: './edit-tcg.page.html',
    styleUrls: ['./edit-tcg.page.scss'],
})
export class EditTCGPage implements OnDestroy {
    private destroyRef = inject(DestroyRef);

    inputFile = viewChild.required<ElementRef>('inputFile');
    image = viewChild.required<ElementRef>('cardImageZoomed')
    
    loaded = signal<boolean>(false);
    hasZoom = signal<boolean>(false);
    card = signal<Card>(new Card());

    readonly generations: Signal<Generation[]>; 
    readonly series: Signal<Serie[]>;
    readonly cardConditions: Signal<CardCondition[]>;

    formGroup!: FormGroup;
    private debounceTimer: any;
    private lastSrcPicture: string = "";
    private panzoom?: PanzoomObject;

    constructor(
        private route: ActivatedRoute,
        private fileService: FileService,
        private mediaService: MediaService,
        private formBuilder: FormBuilder,
        private serieService: SerieService,
        private cardService: CardService,
        private cardConditionService: CardConditionService,
        private toastService: ToastService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private generationService: GenerationService,
        private location: Location,
    ) 
    {
        this.generations = this.generationService.generations; 
        this.series = this.serieService.series; 
        this.cardConditions = this.cardConditionService.cardConditions; 
    }

    //on évite ainsi avec ce lifecycle de faire ramer avec l'animation
    async ionViewDidEnter() {    
        // Ecoute de l'event si l'url change. On ne repasse pas 2 fois dans un ngOnInit normalement
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (params) => {
            this.setLoaded(false);

            const id = Number(params.get('id'));

            if (Capacitor.isNativePlatform() && id){
                this.setCard(await this.cardService.getById(id));
                this.lastSrcPicture = this.card().srcPicture;
            }

            this.createForm();
         
            this.setLoaded(true);
        });
    }

    ngOnDestroy() {
        clearTimeout(this.debounceTimer);
        
        this.panzoom?.destroy();
        this.panzoom = undefined
    }

    initZoom(event: any){  
        this.setHasZoom(true);

        // ne s'execute qu'une fois le code exécuté e  le navigateur a rendu/mis à jour le DOM.
        setTimeout(()=> {
            this.panzoom = Panzoom( this.image().nativeElement, {
                maxScale: 5,
                minScale: 1,
            })
            
            // on init le zoom au min
            this.panzoom.zoom(1);

            const me = this;
            setTimeout(() => me.panzoom?.pan(0, 0)); // pas de translate
        })             
    }

    closeZoom(){
        this.panzoom?.reset({ animate: true });
        this.panzoom?.resetStyle();
        this.panzoom?.destroy();

        this.setHasZoom(false);
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            id: [this.card()?.id],
            name: [this.card()?.name, Validators.compose([Validators.required])],
            srcPicture: [this.card()?.srcPicture, Validators.required],
            averagePrice: [this.card()?.averagePrice, null],
            isAcquired: [this.card()?.isAcquired, null],
            serieID: [this.card()?.serieID, Validators.required],
            generationID: [this.card()?.generationID, Validators.required],
            conditionID: [this.card()?.conditionID, null],
            isLegendary: [this.card()?.isLegendary, Validators.required],
            dateAcquired: [this.card()?.dateAcquired ?? (new Date()).toISOString(), null],
        });
    }

    getSrc(path: string){
       return this.fileService.getUrlWeb(this.fileService.getPathUri(this.fileService.documentsUri(), path));
    }

    getPath(fileName: string){
        return `${folder.TCG}/${fileName}`;
    }

    private async deleteLastFile(){
        if (this.lastSrcPicture){
            await this.fileService.deleteFile(this.lastSrcPicture);
        }
    }

    async onSubmit(card: Card) {
        card.dateAcquired = Card.getPeriod(new Date(card.dateAcquired ?? ""));

        let result = this.card().id > 0 ? await this.cardService.update(card) : await this.cardService.create(card),
        isSuccess = (result.changes?.changes ?? 0) > 0;

        await this.toastService.get(isSuccess ? MessageEnum.AppSuccess : MessageEnum.AppError, isSuccess ? StatusEnum.Success : StatusEnum.Danger);

        if(this.card().id == 0){
            this.createForm();

            // On reset les éléments dynamique
            this.lastSrcPicture = "";

            this.setCard(new Card());
        } 

        this.cardService.notifyCardsChanged();
        this.location.back();
    }

    async onDelete() {
        var me = this;

        let callback = async function(){
            let result = await me.cardService.delete(me.card().id),
                isSuccess = (result.changes?.changes ?? 0) > 0;

                if (isSuccess)  
                    me.deleteLastFile();

                await me.toastService.get(isSuccess ? MessageEnum.AppSuccess : MessageEnum.AppError, isSuccess ? StatusEnum.Success : StatusEnum.Danger);
                
                me.cardService.notifyCardsChanged();
                me.location.back();
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
        this.inputFile().nativeElement.click();
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
    }

    setLoaded(value: boolean){
        this.loaded.set(value);
    }

    setHasZoom(value: boolean){
        this.hasZoom.set(value);
    }

    setCard(value: Card){
        this.card.set({...value});
    }
}
