import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from 'src/app/models/Currency';
import { Rate } from 'src/app/models/Rate';
import { ExchangeRateService } from 'src/app/services/entities/exchange-rate.service';
import { AmountService } from 'src/app/services/services.common/amount.service';

@Component({
    standalone: false,
    selector: 'app-convert',
    templateUrl: './convert.page.html',
    styleUrls: ['./convert.page.scss'],
})
export class ConvertPage implements OnInit, OnDestroy {
    formGroup!: FormGroup;

    currencies!: Currency[];
    private rates!: Rate[];

    convertResult: number = 0;
    private debounceTimer: any;

    loaded: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private exchangeRateService: ExchangeRateService,
        private amountService: AmountService,
    ) {}

    async ngOnInit() {
        const pCurrencies = this.exchangeRateService.getCurrencies();
        const pRates = this.exchangeRateService.getRates();

        // On attend le resultats des promises pour mettre à jour les variables
        await Promise.all([pCurrencies, pRates]).then((datas) => {
            this.currencies = datas[0];
            this.rates = datas[1];
        });
        
        this.loaded = true;

        this.createForm();
    }

    ngOnDestroy() {
        clearTimeout(this.debounceTimer);
    }

    private createForm() {
        this.formGroup = this.formBuilder.group({
            originalCurrency: ['', Validators.compose([Validators.required])],
            amount: ['', Validators.required],
            targetCurrency: ['', Validators.required],
        });
    }

    submit(form: any) {
        this.convertResult = this.exchangeRateService.converTo(
            this.rates,
            form.originalCurrency,
            form.targetCurrency,
            form.amount,
        );
    }

    formatAmountInput(event: CustomEvent) {
        clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
            this.amountService.formatAmountInput("amount", event.detail.value, this.formGroup);
        }, 800);
    }
}
