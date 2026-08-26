import { Component, ViewChild, WritableSignal } from '@angular/core';
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

    private cardSort: WritableSignal<CardSort> = this.cardService.cardSort;

    sortEnum = SortEnum;
    formGroup!: FormGroup;

    constructor(private formBuilder: FormBuilder, private cardService: CardService){
        this.createForm();
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            generationAscending: [this.cardSort().generationAscending],
            nameAscending: [this.cardSort().nameAscending],
        });
    }

    onSubmit(datas: CardSort) {
        let cardSort = new CardSort();
        cardSort.generationAscending = datas.generationAscending;
        cardSort.nameAscending = datas.nameAscending;

        this.modalSorts.dismiss();

        this.cardService.setCardSort(cardSort);
    }
}
