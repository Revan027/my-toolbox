import { Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from 'src/app/models/Currency';
import { Rate } from 'src/app/models/Rate';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { AmountService } from 'src/app/services/services.common/amount.service';

@Component({
    standalone: false,
    selector: 'app-convert',
    templateUrl: './convert.page.html',
    styleUrls: ['./convert.page.scss'],
})
export class ConvertPage implements OnInit, OnDestroy {
    convertResult = signal<number>(0);

    readonly currencies: Signal<Currency[]>;
    private readonly rates: Signal<Rate[]>;

    private debounceTimer: any;

    formGroup!: FormGroup;
    
    constructor(
        private formBuilder: FormBuilder,
        private exchangeRateService: ExchangeRateService,
        private amountService: AmountService,
    ) {
        this.currencies = this.exchangeRateService.currency;
        this.rates = this.exchangeRateService.rates;
    }

    async ngOnInit() {
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
        this.convertResult.set(this.exchangeRateService.converTo(
            this.rates(),
            form.originalCurrency,
            form.targetCurrency,
            form.amount,
        ));
    }

    formatAmountInput(event: CustomEvent) {
        clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
            this.amountService.formatAmountInput("amount", event.detail.value, this.formGroup);
        }, 800);
    }
}
