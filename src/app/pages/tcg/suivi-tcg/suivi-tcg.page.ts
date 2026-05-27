import { Component, effect, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { pageTransition } from 'src/app/animations/page-transition.animation';
import { MOCK_CARDS } from 'src/app/constants/mock-data';
import { CardFilter } from 'src/app/models/CardFilter';
import { Generation } from 'src/app/models/Generation';
import { PagedCardResult } from 'src/app/models/PagedCardResult';
import { CardService } from 'src/app/services/entities/card-service';
import { GenerationService } from 'src/app/services/entities/generation-service';
import { FileService } from 'src/app/services/file.services.common/file.service';


@Component({
    standalone: false,
    selector: 'app-suivi',
    templateUrl: './suivi-tcg.page.html',
    styleUrls: ['./suivi-tcg.page.scss'],
})
export class SuiviTCGPage implements OnInit {
    slideForward = pageTransition;

    generations: Generation[] = [];
    pagedCardResult = this.cardService.pagedCardResult;

    searchText: string = '';
    generationsIDs: number[] = [];
    cardFilter: CardFilter = new CardFilter();

    loaded: boolean = false;

    constructor(
        private generationService: GenerationService,
        private cardService: CardService,
        private fileService: FileService
    ) 
    {
        effect(() => {
            if (this.cardService.hasCardsChanged()){
                this.search();

                this.cardService.setHasCardsChanged(false);
            }
        });

        effect(() => {
            if (this.cardService.cardSort()){
                this.search();
            }
        });
    }

    async ngOnInit() {      
        this.generations = await this.generationService.getAll();
    }

    initGenerationColor(generationID: number) {
        const result = this.generationsIDs.some((id) => {
            return generationID == id
        });

        return result ? "tcg" : "light";
    }

    getSrc(uri: string){  
        return this.fileService.getSrcWeb(uri);
    }

    async onGenerationChanged(generationID: number, event: any) {
        let input = event.srcElement;
        const color = this.initGenerationColor(generationID);

        // On ajoute au tableaux les ids de générations pokémon filtrés
        if (input.getAttribute('color') == 'tcg') {

            this.generationsIDs = this.generationsIDs.filter(
                function (value, index, array) {
                    return generationID != value;
                },
            );
        } else {
            this.generationsIDs.push(generationID);
        }

        input.setAttribute('color', color);

        await this.search();
    }

    async onSearchTextChanged() {
        await this.search();
    }

    onSortClicked(){
        this.cardFilter.page = 1;
    }

    async onIonInfinite(event: InfiniteScrollCustomEvent) {
        if (this.loaded)
            return;

        this.cardFilter.page++;

        await this.cardService.refreshSearchCards(this.cardFilter);
           
        await event.target.complete();
    }

    private async search() {
        if (!Capacitor.isNativePlatform()){
            let pagedCardResult = new PagedCardResult();   
            pagedCardResult.cards = MOCK_CARDS;
            pagedCardResult.totalCount = MOCK_CARDS.length;

            this.cardService.setPagedCardResult(pagedCardResult);
        }
        else{
            this.loaded = true;

            this.cardFilter.search = this.searchText;
            this.cardFilter.generationIDs = this.generationsIDs;
            this.cardFilter.page = 1;

            this.cardService.resetSearchCards();
            await this.cardService.refreshSearchCards(this.cardFilter);

            this.loaded = false;
        }       
    }  
}
