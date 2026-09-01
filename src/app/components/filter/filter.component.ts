import { Component, OnInit, signal, Signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { CardCondition } from 'src/app/models/CardCondition';
import { CardFilter } from 'src/app/models/CardFilter';
import { Generation } from 'src/app/models/Generation';
import { Serie } from 'src/app/models/Serie';
import { CardConditionService } from 'src/app/services/card-condition.service';
import { CardService } from 'src/app/services/card.service';
import { GenerationService } from 'src/app/services/generation.service';
import { SerieService } from 'src/app/services/serie.service';

@Component({
    standalone: false,
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
    modalFilters = viewChild<IonModal>('modalFilters');

    readonly cardFilter: Signal<CardFilter>; 
    readonly generations: Signal<Generation[]>; 
    readonly series: Signal<Serie[]>;
    readonly cardConditions: Signal<CardCondition[]>;

    protected generationsIDs = signal<number[]>([]);

    formGroup!: FormGroup;

    constructor(
        private formBuilder: FormBuilder, 
        private cardService: CardService, 
        private generationService: GenerationService,
        private cardConditionService: CardConditionService,
        private serieService: SerieService)
    {       
        this.cardFilter = this.cardService.cardFilter;
        this.generations = this.generationService.generations; 
        this.series = this.serieService.series; 
        this.cardConditions = this.cardConditionService.cardConditions; 
    }

    async ngOnInit() {
        this.createForm();
    }

    hasGenerationSelected(generationID: number) {
        return this.generationsIDs().some((id) => {
            return generationID == id
        });
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            searchText: [this.cardFilter().searchText],
            isAcquired: [this.cardFilter().isAcquired],
            serieIDs: [this.cardFilter().serieIDs],
            isLegendary: [this.cardFilter().isLegendary],
            conditionIDs: [this.cardFilter().conditionIDs],
            minPrice: [this.cardFilter().minPrice],
            maxPrice: [this.cardFilter().maxPrice],
        });
    }

    onSubmit(datas: CardFilter) {
        let cardFilter = new CardFilter();//on recréer une isntance sinon les méthodes ne sont pas passées et de plus le signal n'méttra qu'une fois le set
        cardFilter.generationIDs = this.generationsIDs();
        cardFilter.searchText = datas.searchText;
        cardFilter.isAcquired = datas.isAcquired;
        cardFilter.isLegendary = datas.isLegendary;
        cardFilter.conditionIDs = datas.conditionIDs;
        cardFilter.minPrice = datas.minPrice;
        cardFilter.maxPrice = datas.maxPrice;
        cardFilter.serieIDs = datas.serieIDs;

        this.modalFilters()?.dismiss();

        this.cardService.loadCardFilter(cardFilter);
    }

    onReset() {     
        this.cardService.loadCardFilter(new CardFilter());
        this.generationsIDs.set([]);
        this.createForm();
        this.modalFilters()?.dismiss();
    }

    async onGenerationChanged(generationID: number, event: any) {
        if(!this.generationsIDs().includes(generationID)){
            let generationsIDs = this.generationsIDs();
            generationsIDs.push(generationID);

            this.generationsIDs.set(generationsIDs);
        }else{
            let generationsIDs = this.generationsIDs().filter((item: number) => item !== generationID);
            this.generationsIDs.set(generationsIDs);
        }
    }
}
