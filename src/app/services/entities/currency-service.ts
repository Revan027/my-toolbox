import { Injectable } from '@angular/core';
import { StorageService } from '../common/storage-service';
import { Currency } from 'src/app/models/Currency';
import { tableName } from 'src/app/constants/table-names';

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {
    constructor(private storageService: StorageService) {}

    async saveCache(currencies: Currency[]) {
        await this.delete(); // On efface le cache
        await this.create(currencies);
        await this.getAll();
    }

    async create(currencies: Currency[]) {
        await Promise.all(currencies.map((currency) => {
            const sql = `INSERT INTO ${tableName.currency} (symbol, name) VALUES ("${currency.symbol}", "${currency.name}")`;

            return this.storageService.getDb().execute(sql);
        }));
    }

    async getAll() {
        let result = await this.storageService
            .getDb()
            .query(`SELECT * FROM ${tableName.currency}`);

        return result.values as Currency[];
    }

    async delete() {
        const sql = `DELETE FROM ${tableName.currency}`;

        return await this.storageService.getDb().execute(sql);
    }
}
