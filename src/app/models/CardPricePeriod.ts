import { CardPricing } from "./CardPricing";

export class CardPricePeriod {

    id?: number = 0;
    date!: string; 
    period!: string;
    prices!: CardPricing[];
}
