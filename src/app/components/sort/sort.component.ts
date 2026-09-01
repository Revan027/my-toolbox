import { Component, Signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { SortEnum } from 'src/app/constants/SortEnum';
import { CardSort } from 'src/app/models/CardSort';
import { CardService } from 'src/app/services/card.service';

@Component({
    standalone: false,
    selector: 'app-sort',
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.scss'],
})
export class SortComponent {
    @ViewChild('modalSorts') modalSorts!: IonModal;

    private cardSort: Signal<CardSort>;

    sortEnum = SortEnum;
    formGroup!: FormGroup;

    constructor(private formBuilder: FormBuilder, private cardService: CardService){
        this.cardSort = this.cardService.cardSort;

        this.createForm();
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            generationAscending: [this.cardSort().generationAscending],
            nameAscending: [this.cardSort().nameAscending],
            priceAscending: [{value: this.cardSort().priceAscending, disabled: this.cardSort().nameAscending}, null],
        });
    }

    onChangePriceSort(event: CustomEvent){
        if(event.detail.checked){
            this.formGroup.get("nameAscending")?.disable();
            this.formGroup.get("generationAscending")?.disable();
        }else{
            this.formGroup.get("nameAscending")?.enable();
            this.formGroup.get("generationAscending")?.enable();
        }
    }

    onChangeMainSort(event: CustomEvent){
        if(this.formGroup.get("nameAscending")?.value === false && this.formGroup.get("generationAscending")?.value === false){
             this.formGroup.get("priceAscending")?.enable();
        }else{
            this.formGroup.get("priceAscending")?.disable();
        }
    }

    onSubmit(datas: CardSort) {
        let cardSort = new CardSort();
        cardSort.generationAscending = datas.generationAscending;
        cardSort.nameAscending = datas.nameAscending;
        cardSort.priceAscending = datas.priceAscending;

        this.modalSorts.dismiss();

        this.cardService.loadCardSort(cardSort);
    }
}
