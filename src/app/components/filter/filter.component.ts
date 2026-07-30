import { Component, OnInit, ViewChild, WritableSignal, signal, Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { CardFilter } from 'src/app/models/CardFilter';
import { Generation } from 'src/app/models/Generation';
import { Serie } from 'src/app/models/Serie';
import { CardService } from 'src/app/services/entities/card-service';
import { GenerationService } from 'src/app/services/entities/generation-service';
import { SerieService } from 'src/app/services/entities/serie-service';

@Component({
    standalone: false,
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
    @ViewChild('modalFilters') modalFilters!: IonModal;

    private cardFilter: WritableSignal<CardFilter> = this.cardService.cardFilter;

    generationsIDs = signal<number[]>([]);

    generations: Generation[] = []; 
    series: Serie[] = [];
    formGroup!: FormGroup;

    constructor(
        private formBuilder: FormBuilder, 
        private cardService: CardService, 
        private generationService: GenerationService,   
        private renderer: Renderer2, 
        private el: ElementRef,
        private serieService: SerieService){       
    }

    async ngOnInit() {
        this.generations = await this.generationService.getAll();
        this.series = await this.serieService.getAll();

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
            minPrice:  [this.cardFilter().minPrice],
            maxPrice:  [this.cardFilter().maxPrice],
        });
    }

    onSubmit(datas: CardFilter) {
        let cardFilter = new CardFilter();//on recréer une isntance sinon les méthodes ne sont pas passées et de plus le signal n'méttra qu'une fois le set
        cardFilter.generationIDs = this.generationsIDs();
        cardFilter.searchText = datas.searchText;
        cardFilter.isAcquired = datas.isAcquired;
        cardFilter.minPrice = datas.minPrice;
        cardFilter.maxPrice = datas.maxPrice;
        cardFilter.serieIDs = datas.serieIDs;

        this.modalFilters.dismiss();

        this.cardService.setCardFilter(cardFilter);
    }

    onReset() {     
        this.cardService.setCardFilter(new CardFilter());
        this.generationsIDs.set([]);
        this.createForm();

        this.modalFilters.dismiss();
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
