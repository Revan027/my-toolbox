import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Currency, CurrencyResponse } from 'src/app/models/Currency';
import { Rate } from 'src/app/models/Rate';
import { CurrencyService } from './currency-service';
import { RateService } from './rate-service';
import { Network } from '@capacitor/network';
import { HttpService } from '../common/http-service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ExchangeRateService {
    constructor(
        private httpService: HttpService,
        private currencyService: CurrencyService,
        private rateService: RateService,
    ) {}

    async getRates(): Promise<Rate[]> {
        let rates: Rate[];
        const status = await Network.getStatus();

        // en ligne on recupère les taux de conversion sinon on prend le cache en base
        if (status.connected) {
            let response = await lastValueFrom(
                this.httpService
                    .get<any>(
                        `${environment.apiBaseUrl}/rates/latest?apikey=${environment.apiKey}`,
                    )
                    .pipe(map((rate) => rate.rates)),
            );

            rates = Object.entries(response)
                .filter(
                    ([key, value]) =>
                        key == 'EUR' || key == 'DOP' || key == 'USD',
                )
                .map(([key, value]) => {
                    let currency = new Rate();
                    currency.amount = value as number;
                    currency.symbol = key;

                    return currency;
                });

            // on crée le cache de manière asynchrone pour pas bloquer
            this.rateService.saveCache(rates);
        } else {
            rates = await this.rateService.getAll();
        }

        return rates;
    }

    async getCurrencies(): Promise<Currency[]> {
        let currencies!: Currency[];

        const status = await Network.getStatus();

        // en ligne on recupère les devises sinon on prend le cache en base
        if (status.connected) {
            let datas = await lastValueFrom(
                this.httpService
                    .get<CurrencyResponse>(
                        `${environment.apiBaseUrl}/currency-symbols`,
                    )
                    .pipe(map((datas) => datas.currencySymbols)),
            );

            currencies = Object.entries(datas)
                .filter(
                    ([key, value]) =>
                        key == 'EUR' || key == 'DOP' || key == 'USD',
                )
                .map(([key, value]) => {
                    let currency = new Currency();
                    currency.name = value as string;
                    currency.symbol = key;

                    return currency;
                })
                .sort((a, b) => (a.name > b.name ? 1 : -1));

            // on crée le cache de manière asynchrone pour pas bloquer
            this.currencyService.saveCache(currencies);
        } else {
            currencies = await this.currencyService.getAll();
        }

        return currencies;
    }

    roundTo(amount: number, decimal: number) {
        const factor = Math.pow(10, decimal);

        return Math.round(amount * factor) / factor;
    }

    converTo(
        rates: Rate[],
        originalCurrency: string,
        targetCurrency: string,
        amount: number,
    ) {
        // On va chercher le taux de conversion d'un euros en dollards
        const originalRate = rates.find((x) => x.symbol == originalCurrency);
        const targetRate = rates.find((x) => x.symbol == targetCurrency);
        let result = 0;

        if (originalRate != undefined && targetRate != undefined) {
            let toDollard = this.roundTo(amount / this.roundTo(originalRate.amount, 5), 2);

            result = toDollard * this.roundTo(targetRate.amount, 5);
        }

        return this.roundTo(result, 2);
    }
}
