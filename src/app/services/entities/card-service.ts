import { Injectable, signal } from '@angular/core';
import { StorageService } from '../common/storage-service';
import { Card } from 'src/app/models/Card';
import { tableName } from 'src/app/constants/table-names';
@Injectable({
    providedIn: 'root',
})
export class CardService {
    cards = signal<Card[]>([]);

    constructor(private storageService: StorageService) {}

    async getAll() {
        let result = await this.storageService.getDb().query(`SELECT * FROM ${tableName.card}`);

        return result.values as Card[];
    }

    async getById(id: number) {
        let result = await this.storageService.getDb().query(`
            SELECT generation.id AS generationID, generation.libelle AS generation_libelle, card.id, card.name, card.srcPicture, card.picture, card.isPriority, card.averagePrice, card.serieID, serie.name AS serie_name, serie.srcLogo As serie_src_logo
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

    async search(search: string, generationIDs: number[]) {
        // Si on a pas de valeur de filtre on fait un Where TRUE pour ne pas filtrer
        let result = await this.storageService.getDb().query(`
            SELECT card.id, card.name, card.srcPicture, card.averagePrice, card.isPriority, card.serieID, serie.srcLogo As serie_src_logo
            FROM ${tableName.card} AS card 
            INNER JOIN ${tableName.generation} AS generation ON ${tableName.generation}.id = generationID
            INNER JOIN ${tableName.serie} AS serie ON ${tableName.serie}.id = serieId WHERE
            (${search?.length > 0 ? 'FALSE' : 'TRUE'} OR lower(card.name) LIKE '%${search.toLowerCase()}%') AND 
            (${generationIDs?.length > 0 ? 'FALSE' : 'TRUE'} OR card.generationID IN (${generationIDs})) `);
        
            const cards: Card[] = result.values?.map((data: any)=>{
                return Card.fromSQL(data);
            })|| [];   

        return cards;
    }

    async create(card: Card) {
        const sql = `
            INSERT INTO ${tableName.card} (name, srcPicture, averagePrice, isPriority, serieID, generationID, picture) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const result = await this.storageService.getDb().run(sql, [card.name, card.srcPicture, card.averagePrice, card.isPriority, card.serieID, card.generationID, card.picture]);

        return result;
    }

    async update(card: Card) {
        const sql = `
            UPDATE ${tableName.card} 
            SET name = "${card.name}", srcPicture = "${card.srcPicture}", averagePrice = "${card.averagePrice}", isPriority = "${card.isPriority}", serieID = "${card.serieID}", generationID = "${card.generationID}", picture = "${card.picture}" 
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

    async refreshAllCards() {
        const cards = await this.getAll();

        this.cards.set(cards);
    }

    async refreshSearchCards(search: string, generationIDs: number[]) {
        const cards = await this.search(search, generationIDs);

        this.cards.set(cards);
    }
}
