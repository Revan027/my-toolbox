import { Injectable, signal } from '@angular/core';
import { Card } from 'src/app/models/Card';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { CardFilter } from 'src/app/models/CardFilter';
import { PagedCardResult } from 'src/app/models/PagedCardResult';
import { CardSort } from 'src/app/models/CardSort';
import { SortEnum } from 'src/app/constants/SortEnum';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CardService {    
    cardSort = signal<CardSort>(new CardSort());
    cardFilter = signal<CardFilter>(new CardFilter());
    pagedCardResult = signal<PagedCardResult>(new PagedCardResult());
    private cardsChanged$ = new Subject<void>();
    readonly cardsChanged = this.cardsChanged$.asObservable();

    readonly offsetBase: number = 16;
     
    constructor(private storageService: StorageService) {}

    async create(card: Card) {
        const sql = `
            INSERT INTO ${tableName.card} (name, srcPicture, averagePrice, isAcquired, serieID, generationID, picture, isLegendary, conditionID, dateAcquired) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await this.storageService.getDb().run(sql, 
            [
                card.name, 
                card.srcPicture, 
                card.averagePrice, 
                card.isAcquired, 
                card.serieID, 
                card.generationID, 
                card.picture,
                card.isLegendary, 
                card.conditionID, 
                card.dateAcquired,
            ]);

        return result;
    }

    async update(card: Card) {
        const sql = `
            UPDATE ${tableName.card}
            SET name = ?, srcPicture = ?, averagePrice = ?, isAcquired = ?, serieID = ?, generationID = ?, picture = ?, isLegendary = ?, conditionID = ?, dateAcquired = ?
            WHERE id = ?`;

        return await this.storageService.getDb().run(sql, 
            [
            card.name, 
            card.srcPicture, 
            card.averagePrice, 
            card.isAcquired,
            card.serieID, 
            card.generationID, 
            card.picture, 
            card.isLegendary, 
            card.conditionID, 
            card.dateAcquired,
            card.id,
        ]);
    }

    async updatePicture(card: Card) {
        const sql = `
            UPDATE ${tableName.card} 
            SET srcPicture = "${card.srcPicture}" 
            WHERE id = "${card.id}"`;

        return await this.storageService.getDb().execute(sql);
    }

    async delete(id: number) {
        const sql = `DELETE FROM ${tableName.card} WHERE id = ${id}`;

        const result = await this.storageService.getDb().execute(sql);

        return result;
    }

    async getAll() {
        let result = await this.storageService.getDb().query(`
            SELECT id, name, srcPicture, isAcquired, averagePrice, serieID
            FROM ${tableName.card}`);

        return result.values as Card[];
    }

    async getById(id: number) {
        let result = await this.storageService.getDb().query(`
            SELECT 
            generation.id AS generationID, generation.libelle AS generation_libelle, 
            card.id, card.name, card.srcPicture, card.picture, card.isAcquired, card.averagePrice, card.serieID, card.isLegendary, card.conditionID, card.dateAcquired, 
            serie.name AS serie_name, serie.srcLogo As serie_src_logo
            FROM ${tableName.card} AS card 
            INNER JOIN ${tableName.serie} AS serie ON ${tableName.serie}.id = serieId 
            INNER JOIN ${tableName.generation} AS generation ON ${tableName.generation}.id = generationID
            WHERE card.id = ${id}`);

        const card: Card = result.values?.map((data: any)=>{
            return Card.fromSQL(data);
        })[0] || new Card();
    
        return card;
    }

    async getPicture(id: number): Promise<string> {
        let result = await this.storageService.getDb().query(`
            SELECT picture
            FROM ${tableName.card} AS card 
            WHERE card.id = ${id}`);

        const card: Card = result.values?.map((data: any)=>{
            return Card.fromSQL(data);
        })[0] || new Card();
    
        return card.picture || "";
    }
   
    getQuerySearch(cardFilter: CardFilter){
        return`
            INNER JOIN ${tableName.generation} AS generation ON ${tableName.generation}.id = generationID
            INNER JOIN ${tableName.serie} AS serie ON ${tableName.serie}.id = serieId 
            WHERE
                (${cardFilter.searchText.length > 0 ? 'FALSE' : 'TRUE'} OR lower(card.name) LIKE '%${cardFilter.searchText.toLowerCase()}%') AND
                (${!cardFilter.isAcquired ? 'TRUE' : 'FALSE'} OR card.isAcquired IS ${cardFilter.isAcquired || false}) AND 
                (${!cardFilter.isLegendary ? 'TRUE' : 'FALSE'} OR card.isLegendary IS ${cardFilter.isLegendary || false}) AND  
                (${cardFilter.minPrice != undefined ? 'FALSE' : 'TRUE'} OR card.averagePrice >= ${cardFilter.minPrice || 0}) AND 
                (${cardFilter.maxPrice != undefined  ? 'FALSE' : 'TRUE'} OR card.averagePrice <= ${cardFilter.maxPrice || 0}) AND 
                (${cardFilter.serieIDs.length > 0 ? 'FALSE' : 'TRUE'} OR card.serieID IN (${cardFilter.serieIDs})) AND  
                (${cardFilter.conditionIDs.length > 0 ? 'FALSE' : 'TRUE'} OR card.conditionID IN (${cardFilter.conditionIDs})) AND                
                (${cardFilter.generationIDs.length > 0 ? 'FALSE' : 'TRUE'} OR card.generationID IN (${cardFilter.generationIDs}))`;
    }

    private getQuerySort(cardSort: CardSort){
        return`
            ORDER BY 
                ${this.cardSort().generationAscending == undefined ? "TRUE" : `card.generationID ${this.getSortDirection(this.cardSort().generationAscending as boolean)}`},
                ${this.cardSort().nameAscending == undefined ? "TRUE" : `card.name COLLATE NOCASE ${this.getSortDirection(this.cardSort().nameAscending as boolean)}`},
                ${this.cardSort().priceAscending === true ? `card.averagePrice ${SortEnum.DESC} NULLS LAST` : "TRUE"}`;
    }

    getSortDirection(checked: boolean): string{
        return checked ? SortEnum.ASC : SortEnum.DESC
    }

    private async fetchPage(offset: number): Promise<PagedCardResult> {
        // Si on a pas de valeur de filtre on fait un Where TRUE pour ne pas filtrer
        let result = await this.storageService.getDb().query(`
            SELECT 
                card.id, card.name, card.srcPicture, card.averagePrice, card.isAcquired, card.serieID, card.isLegendary,
                serie.srcLogo as serie_src_logo, serie.name as serie_name
            FROM ${tableName.card} AS card 
            ${this.getQuerySearch(this.cardFilter())}
            ${this.getQuerySort(this.cardSort())}          
            LIMIT ${this.offsetBase} OFFSET ${offset}`);

        const cards: Card[] = result.values?.map((data: any)=>{
            return Card.fromSQL(data);
        })|| [];   

        let pagedCardResult = new PagedCardResult();   
        pagedCardResult.cards = cards;
        pagedCardResult.totalCount = await this.countSearch(this.cardFilter());

        return pagedCardResult;
    }

    private async countSearch(cardFilter: CardFilter): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount FROM ${tableName.card} AS card
            ${this.getQuerySearch(cardFilter)}`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    async loadNextPage() {
        let nextPage = this.pagedCardResult().page + 1;
        let offset = this.offsetBase * (nextPage - 1);

        const pagedCardResult = await this.fetchPage(offset);
        pagedCardResult.cards = this.pagedCardResult().cards.concat(pagedCardResult.cards);
        pagedCardResult.page = nextPage;

        this.setPagedCardResult(pagedCardResult);
    }

    resetPagedCardResult() {
        this.pagedCardResult.set(new PagedCardResult());
    }

    // set() : remplacement complet (primitif ou nouvel objet) — nouvelle référence garantie
    // update() : modification partielle → utiliser le spread { ...current, prop: newValue } pour créer une nouvelle référence
    setPagedCardResult(pagedCardResult: PagedCardResult) {
        this.pagedCardResult.set(pagedCardResult);
    }

    setCardSort(cardSort: CardSort) {
        this.cardSort.set(cardSort);
    }

    setCardFilter(cardFilter: CardFilter) {
        this.cardFilter.set(cardFilter);
    }

    notifyCardsChanged() {
        this.cardsChanged$.next();
    }
}
