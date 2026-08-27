export class CardFilter {
    constructor() {}

    searchText: string = ""
    generationIDs: number[] = [];
    isAcquired?: boolean;
    serieIDs: number[] = [];
    conditionIDs: number[] = [];
    isLegendary?: boolean;
    minPrice?: number;
    maxPrice?: number;
}
