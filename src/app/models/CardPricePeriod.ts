import { CardPricing } from "./CardPricing";

export class CardPricePeriod {

    id!: number;
    date?: string; 
    period?: string;
    prices!: CardPricing[];
}
