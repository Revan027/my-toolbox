import { Injectable } from '@angular/core';
import { Currency } from 'src/app/models/Currency';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './capacitor.services.common/storage-service';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
    providedIn: 'root',
})
export class CurrencyService {
    constructor(private storageService: StorageService) {}

    async saveCache(currencies: Currency[]): Promise<void> {
        await this.delete(); // On efface le cache
        await this.create(currencies);
        await this.getAll();
    }

    private async create(currencies: Currency[]): Promise<void> {
        await Promise.all(currencies.map((currency) => {
            const sql = `INSERT INTO ${tableName.currency} (symbol, name) VALUES ("${currency.symbol}", "${currency.name}")`;

            return this.storageService.getDb().execute(sql);
        }));
    }

    async getAll(): Promise<Currency[]> {
        let result = await this.storageService
            .getDb()
            .query(`SELECT * FROM ${tableName.currency}`);

        return result.values as Currency[];
    }

    private async delete(): Promise<capSQLiteChanges> {
        const sql = `DELETE FROM ${tableName.currency}`;

        return await this.storageService.getDb().execute(sql);
    }
}
