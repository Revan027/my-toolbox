import { Currency } from './Currency';

export class ExchangeRate {
    constructor() {}

    currency!: Currency;
    value: number = 0;
}
