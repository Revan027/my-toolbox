import { Card } from "./Card";

export class PagedCardResult {
    constructor() {}

    totalValue!: number;
    totalCard!: number;
    cards: Card[] = [];
    _isFinished: boolean = false; 
    page: number = 0;

    get isFinished(): boolean {
        return this.totalCard == this.cards.length;
    }
}