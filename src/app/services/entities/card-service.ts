import { Injectable, signal } from '@angular/core';
import { Card } from 'src/app/models/Card';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from '../storage.services.common/storage-service';
import { CardFilter } from 'src/app/models/CardFilter';
import { PagedCardResult } from 'src/app/models/PagedCardResult';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    pagedCardResult = signal<PagedCardResult>(new PagedCardResult());
    hasCardsChanged = signal<boolean>(false);

    constructor(private storageService: StorageService) {}

    async create(card: Card) {
        const sql = `
            INSERT INTO ${tableName.card} (name, srcPicture, averagePrice, isAcquired, serieID, generationID, picture) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const result = await this.storageService.getDb().run(sql, [card.name, card.srcPicture, card.averagePrice, card.isAcquired, card.serieID, card.generationID, card.picture]);

        return result;
    }

    async update(card: Card) {
        const sql = `
            UPDATE ${tableName.card} 
            SET name = "${card.name}", srcPicture = "${card.srcPicture}", averagePrice = "${card.averagePrice}", isAcquired = ${card.isAcquired}, serieID = "${card.serieID}", generationID = "${card.generationID}", picture = "${card.picture}" 
            WHERE id = "${card.id}"`;

        return await this.storageService.getDb().execute(sql);
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
            card.id, card.name, card.srcPicture, card.picture, card.isAcquired, card.averagePrice, card.serieID, 
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
   
    private getQuerySearch(cardFilter: CardFilter){
        return`
            INNER JOIN ${tableName.generation} AS generation ON ${tableName.generation}.id = generationID
            INNER JOIN ${tableName.serie} AS serie ON ${tableName.serie}.id = serieId 
            WHERE
                (${cardFilter.search.length > 0 ? 'FALSE' : 'TRUE'} OR lower(card.name) LIKE '%${cardFilter.search.toLowerCase()}%') AND 
                (${cardFilter.generationIDs.length > 0 ? 'FALSE' : 'TRUE'} OR card.generationID IN (${cardFilter.generationIDs}))`;
    }

    async search(cardFilter: CardFilter): Promise<PagedCardResult> {
        // Si on a pas de valeur de filtre on fait un Where TRUE pour ne pas filtrer
        let result = await this.storageService.getDb().query(`
             SELECT 
                card.id, card.name, card.srcPicture, card.averagePrice, card.isAcquired, card.serieID, 
                serie.srcLogo As serie_src_logo
                FROM ${tableName.card} AS card 
            ${this.getQuerySearch(cardFilter)}
            ORDER BY card.generationID ASC, card.name COLLATE NOCASE ASC
            LIMIT ${cardFilter.offsetBase} OFFSET ${cardFilter.offset}`);
        
        const cards: Card[] = result.values?.map((data: any)=>{
            return Card.fromSQL(data);
        })|| [];   

        let pagedCardResult = new PagedCardResult();   
        pagedCardResult.cards = cards;
        pagedCardResult.totalCount = await this.countSearch(cardFilter);

        return pagedCardResult;
    }

    private async countSearch(cardFilter: CardFilter): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount FROM ${tableName.card} AS card
            ${this.getQuerySearch(cardFilter)}`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    async refreshSearchCards(cardFilter: CardFilter) {
        const pagedCardResult = await this.search(cardFilter);
        pagedCardResult.cards = this.pagedCardResult().cards.concat(pagedCardResult.cards);

        this.pagedCardResult.set(pagedCardResult);
    }

    resetSearchCards() {
        this.pagedCardResult.set(new PagedCardResult());
    }
}
