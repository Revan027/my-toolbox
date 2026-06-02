import { Component, OnInit, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    private cardFilter: WritableSignal<CardFilter> = this.cardService.cardFilter;

    generations: Generation[] = [];
    generationsIDs: number[] = [];
    series: Serie[] = [];
    formGroup!: FormGroup;

    constructor(
        private formBuilder: FormBuilder, 
        private cardService: CardService, 
        private generationService: GenerationService, 
        private serieService: SerieService){       
    }

    async ngOnInit() {
        this.generations = await this.generationService.getAll();
        this.series = await this.serieService.getAll();

        this.createForm();
    }

    initGenerationColor(generationID: number) {
        const result = this.generationsIDs.some((id) => {
            return generationID == id
        });

        return result ? "tcg" : "light";
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
        cardFilter.generationIDs = this.generationsIDs;
        cardFilter.searchText = datas.searchText;
        cardFilter.isAcquired = datas.isAcquired;
        cardFilter.minPrice = datas.minPrice;
        cardFilter.maxPrice = datas.maxPrice;
        cardFilter.serieIDs = datas.serieIDs;

        this.cardService.setCardFilter(cardFilter);
    }

    onReset() {     
        this.cardService.setCardFilter(new CardFilter());
        this.generationsIDs = [];
        this.createForm();
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
        } 
        else {
            this.generationsIDs.push(generationID);
        }

        input.setAttribute('color', color);
    }
}
