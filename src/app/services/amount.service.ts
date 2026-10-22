import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class AmountService {
    constructor(private currencyPipe: CurrencyPipe) {}

    formatAmountInput(inputName: string, inputValue: string, formGroup: FormGroup) {
        inputValue = inputValue.replace(/[^0-9.]/g, '')

        formGroup.get(inputName)?.setValue(this.currencyPipe.transform(inputValue, 'EUR', '', '1.2-2'),{ emitEvent: false },);
    }
}
