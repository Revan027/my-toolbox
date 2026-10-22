import { Injectable, signal } from '@angular/core';
import { Card } from 'src/app/models/Card';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './capacitor.services.common/storage-service';
import { CardFilter } from 'src/app/models/CardFilter';
import { PagedCardResult } from 'src/app/models/PagedCardResult';
import { CardSort } from 'src/app/models/CardSort';
import { SortEnum } from 'src/app/constants/SortEnum';
import { Subject } from 'rxjs';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
    providedIn: 'root',
})
export class CardService {    
    private _cardFilter = signal<CardFilter | undefined>(undefined);
    private _cardSort = signal<CardSort>(new CardSort());
    private _pagedCardResult = signal<PagedCardResult>(new PagedCardResult());
    
    readonly cardFilter = this._cardFilter.asReadonly();
    readonly cardSort = this._cardSort.asReadonly();
    readonly pagedCardResult = this._pagedCardResult.asReadonly();

    private _cardsChanged$ = new Subject<void>();
    private _sortChanged$ = new Subject<void>();
    private _filterChanged$ = new Subject<void>();

    readonly cardsChanged = this._cardsChanged$.asObservable();  
    readonly sortChanged = this._sortChanged$.asObservable();
    readonly filterChanged = this._filterChanged$.asObservable();

    readonly offsetBase: number = 16;
     
    constructor(private storageService: StorageService) {}

    async create(card: Card): Promise<capSQLiteChanges> {
        const sql = `
            INSERT INTO ${tableName.card} (name, srcPicture, averagePrice, isAcquired, serieID, generationID, isLegendary, conditionID, dateAcquired) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await this.storageService.getDb().run(sql, 
            [
                card.name, 
                card.srcPicture, 
                card.averagePrice, 
                card.isAcquired, 
                card.serieID, 
                card.generationID, 
                card.isLegendary, 
                card.conditionID, 
                card.dateAcquired,
            ]);

        return result;
    }

    async update(card: Card): Promise<capSQLiteChanges> {
        const sql = `
            UPDATE ${tableName.card}
            SET name = ?, srcPicture = ?, averagePrice = ?, isAcquired = ?, serieID = ?, generationID = ?, isLegendary = ?, conditionID = ?, dateAcquired = ?
            WHERE id = ?`;

        return await this.storageService.getDb().run(sql, 
            [
            card.name, 
            card.srcPicture, 
            card.averagePrice, 
            card.isAcquired,
            card.serieID, 
            card.generationID, 
            card.isLegendary, 
            card.conditionID, 
            card.dateAcquired,
            card.id,
        ]);
    }

    async updatePicture(card: Card): Promise<capSQLiteChanges> {
        const sql = `
            UPDATE ${tableName.card} 
            SET srcPicture = "${card.srcPicture}" 
            WHERE id = "${card.id}"`;

        return await this.storageService.getDb().execute(sql);
    }

    async delete(id: number): Promise<capSQLiteChanges> {
        const sql = `DELETE FROM ${tableName.card} WHERE id = ${id}`;

        const result = await this.storageService.getDb().execute(sql);

        return result;
    }

    async getAll(): Promise<Card[]> {
        let result = await this.storageService.getDb().query(`
            SELECT id, name, srcPicture, isAcquired, averagePrice, serieID
            FROM ${tableName.card}`);

        return result.values as Card[];
    }

    async getById(id: number): Promise<Card> {
        let result = await this.storageService.getDb().query(`
            SELECT 
            generation.id AS generationID, generation.libelle AS generation_libelle, 
            card.id, card.name, card.srcPicture, card.isAcquired, card.averagePrice, card.serieID, card.isLegendary, card.conditionID, card.dateAcquired, 
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

    async getLastAcquisition(take: number): Promise<PagedCardResult> {
        let result = await this.storageService.getDb().query(`
             SELECT 
                card.id, card.name, card.srcPicture, card.averagePrice, card.isAcquired, card.serieID, card.isLegendary,
                serie.srcLogo as serie_src_logo, serie.name as serie_name
            FROM ${tableName.card} AS card 
            INNER JOIN ${tableName.generation} AS generation ON ${tableName.generation}.id = generationID
            INNER JOIN ${tableName.serie} AS serie ON ${tableName.serie}.id = serieId 
            WHERE card.isAcquired = 1
            ORDER BY card.dateAcquired DESC
            LIMIT ${take}`);

         const cards: Card[] = result.values?.map((data: any)=>{
            return Card.fromSQL(data);
        })|| [];  
    
        let pagedCardResult = new PagedCardResult();   
        pagedCardResult.cards = cards;
        pagedCardResult.totalCard = cards.length;
        pagedCardResult.totalValue = cards.map(x => x.averagePrice).reduce((x, y) => x + y);

        return pagedCardResult;
    }

    getQuerySearch(cardFilter: CardFilter): string{
        const queryAcquired = cardFilter.isAcquired === true ? "card.isAcquired = 1" : cardFilter.isNotAcquired === true ? "card.isAcquired = 0" : "TRUE";
        const queryLegendary = cardFilter.isLegendary === true ? "card.isLegendary = 1" : cardFilter.isNotLegendary === true ? "card.isLegendary = 0" : "TRUE";

        return`
            INNER JOIN ${tableName.generation} AS generation ON ${tableName.generation}.id = generationID
            INNER JOIN ${tableName.serie} AS serie ON ${tableName.serie}.id = serieId 
            WHERE
                (${cardFilter.searchText?.length > 0 ? 'FALSE' : 'TRUE'} OR lower(card.name) LIKE '%${cardFilter.searchText?.toLowerCase()}%') AND
                (${queryAcquired}) AND  
                (${queryLegendary}) AND    
                (${cardFilter.minPrice != undefined ? 'FALSE' : 'TRUE'} OR card.averagePrice >= ${cardFilter.minPrice || 0}) AND 
                (${cardFilter.maxPrice != undefined  ? 'FALSE' : 'TRUE'} OR card.averagePrice <= ${cardFilter.maxPrice || 0}) AND 
                (${cardFilter.serieIDs?.length > 0 ? 'FALSE' : 'TRUE'} OR card.serieID IN (${cardFilter.serieIDs})) AND  
                (${cardFilter.conditionIDs?.length > 0 ? 'FALSE' : 'TRUE'} OR card.conditionID IN (${cardFilter.conditionIDs})) AND                
                (${cardFilter.generationIDs?.length > 0 ? 'FALSE' : 'TRUE'} OR card.generationID IN (${cardFilter.generationIDs}))`;
    }

    private getQuerySort(cardSort: CardSort): string{
        return`
            ORDER BY 
                ${cardSort.generationAscending == undefined ? "TRUE" : `card.generationID ${this.getSortDirection(cardSort.generationAscending as boolean)}`},
                ${cardSort.nameAscending == undefined ? "TRUE" : `card.name COLLATE NOCASE ${this.getSortDirection(cardSort.nameAscending as boolean)}`},
                ${cardSort.priceAscending === true ? `card.averagePrice ${SortEnum.DESC} NULLS LAST` : "TRUE"}`;
    }

    private getSortDirection(checked: boolean): string{
        return checked ? SortEnum.ASC : SortEnum.DESC
    }

    private async fetchPage(cardFilter: CardFilter, cardSort: CardSort, offset: number, offsetBase: number | undefined = undefined): Promise<PagedCardResult> {
        // Si on a pas de valeur de filtre on fait un Where TRUE pour ne pas filtrer
        let result = await this.storageService.getDb().query(`
            SELECT 
                card.id, card.name, card.srcPicture, card.averagePrice, card.isAcquired, card.serieID, card.isLegendary,
                serie.srcLogo as serie_src_logo, serie.name as serie_name
            FROM ${tableName.card} AS card 
            ${this.getQuerySearch(cardFilter)}
            ${this.getQuerySort(cardSort)}          
            LIMIT ${offsetBase != undefined ? offsetBase : this.offsetBase} OFFSET ${offset}`);

        const cards: Card[] = result.values?.map((data: any)=>{
            return Card.fromSQL(data);
        })|| [];   

        let pagedCardResult = new PagedCardResult();   
        pagedCardResult.cards = cards;
        pagedCardResult.totalCard = await this.countTotalCardSearch(cardFilter);
        pagedCardResult.totalValue = await this.countTotalValueSearch(cardFilter);

        return pagedCardResult;
    }

    private async countTotalCardSearch(cardFilter: CardFilter): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount FROM ${tableName.card} AS card
            ${this.getQuerySearch(cardFilter)}`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    private async countTotalValueSearch(cardFilter: CardFilter): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalCount FROM ${tableName.card} AS card
            ${this.getQuerySearch(cardFilter)}`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    async loadPage(cardFilter: CardFilter, cardSort: CardSort): Promise<void> {
        let pagedCardResult: PagedCardResult;

        if(cardFilter != undefined){
            let nextPage = this.pagedCardResult().page + 1;
            let offset = this.offsetBase * (nextPage - 1);

            pagedCardResult = await this.fetchPage(cardFilter, cardSort, offset);
            pagedCardResult.cards = this.pagedCardResult().cards.concat(pagedCardResult.cards);
            pagedCardResult.page = nextPage;
        }
        else{
           pagedCardResult = await this.getLastAcquisition(10);
        }

       
        this.setPagedCardResult(pagedCardResult);
    }

    async refreshPage(cardFilter: CardFilter, cardSort: CardSort): Promise<void> {
        let pagedCardResult: PagedCardResult;

        if(cardFilter != undefined){
            pagedCardResult = await this.fetchPage(cardFilter , cardSort, 0, this.pagedCardResult().cards.length);
            pagedCardResult.page = this.pagedCardResult().page;
        }
        else{
            pagedCardResult = await this.getLastAcquisition(10);
        }

        this.setPagedCardResult(pagedCardResult);
    }

    resetPagedCardResult(): void {
        this._pagedCardResult.set(new PagedCardResult());
    }

    // set() : remplacement complet (primitif ou nouvel objet) — nouvelle référence garantie
    // update() : modification partielle → utiliser le spread { ...current, prop: newValue } pour créer une nouvelle référence
    setPagedCardResult(pagedCardResult: PagedCardResult): void {
        this._pagedCardResult.set(pagedCardResult);
    }

    setCardSort(cardSort: CardSort): void {
        this._cardSort.set(cardSort);

        this.notifySortChanged();
    }

    setCardFilter(cardFilter: CardFilter | undefined): void {
        if(cardFilter != undefined){
            this._cardFilter.set(cardFilter);
        }
        else{
            this._cardFilter.update((x) => x = cardFilter);
        }
        
        this.notifyFilterChanged();
    }

    notifyCardsChanged(): void {
        this._cardsChanged$.next();
    }

    private notifySortChanged(): void {
        this._sortChanged$.next();
    }

    private notifyFilterChanged(): void {
        this._filterChanged$.next();
    }
}
