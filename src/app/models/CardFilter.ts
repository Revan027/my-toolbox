export class CardFilter {
    constructor() {}

    readonly offsetBase: number = 15;
    count: number = 0;
    search: string = ""
    generationIDs: number[] = [];
    page: number = 1;
    _offset: number = 0;

    get offset(): number {
        return this.offsetBase * (this.page - 1);
    }
 
}