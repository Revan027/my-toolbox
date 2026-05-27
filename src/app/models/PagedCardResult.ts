import { Card } from "./Card";

export class PagedCardResult {
    constructor() {}

    totalCount!: number;
    cards: Card[] = [];
    _isFinished: boolean = false; 
    page: number = 0;

    get isFinished(): boolean {
        return this.totalCount == this.cards.length;
    }
}