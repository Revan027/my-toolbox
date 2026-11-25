import { TCGDexCardLight } from "./TCGDexCard"

export class TCGDexCard extends TCGDexCardLight
{
    pricing?: TCGDexPricing;
}

export class TCGDexPricing
{
    cardmarket?: CardmarketPricing;
}

export class CardmarketPricing
{
    updated?: string;
    avg30?: number;
} 