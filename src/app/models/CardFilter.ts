export class CardFilter {
    constructor() {}

    searchText: string = ""
    generationIDs: number[] = [];
    isAcquired?: boolean;
    isNotAcquired?: boolean;
    serieIDs: number[] = [];
    conditionIDs: number[] = [];
    isLegendary?: boolean;
    isNotLegendary?: boolean;
    minPrice?: number;
    maxPrice?: number;
}
