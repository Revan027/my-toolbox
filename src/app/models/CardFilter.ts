export class CardFilter {
    constructor() {}

    searchText: string = ""
    generationIDs: number[] = [];
    isAcquired?: boolean;
    serieIDs: number[] = [];
    minPrice?: number;
    maxPrice?: number;
}
