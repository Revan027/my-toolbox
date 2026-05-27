import { Component, OnInit, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CardFilter } from 'src/app/models/CardFilter';
import { Generation } from 'src/app/models/Generation';
import { CardService } from 'src/app/services/entities/card-service';
import { GenerationService } from 'src/app/services/entities/generation-service';

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
    formGroup!: FormGroup;

    constructor(private formBuilder: FormBuilder, private cardService: CardService, private generationService: GenerationService){       
    }

    async ngOnInit() {
        this.generations = await this.generationService.getAll();

        this.createForm();
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            searchText: [this.cardFilter().searchText],
        });
    }

    onSubmit(datas: any) {
        let cardFilter = new CardFilter();
        cardFilter.generationIDs = this.generationsIDs;
        cardFilter.searchText = datas.searchText;

        this.cardService.updateCardFilter(cardFilter);
    }

    initGenerationColor(generationID: number) {
        const result = this.generationsIDs.some((id) => {
            return generationID == id
        });

        return result ? "tcg" : "light";
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
