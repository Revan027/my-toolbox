import { Injectable } from '@angular/core';
import { Rate } from 'src/app/models/Rate';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Injectable({
    providedIn: 'root',
})
export class RateService {
    constructor(private storageService: StorageService) {}

    async saveCache(currencies: Rate[]): Promise<void> {
        await this.delete(); // On efface le cache
        await this.create(currencies);
    }

    private async create(rates: Rate[]): Promise<void> {
        await Promise.all(rates.map((rate) => {
            const sql = `INSERT INTO ${tableName.rate} (symbol, amount) VALUES ("${rate.symbol}", "${rate.amount}" )`;

            return this.storageService.getDb().execute(sql);
        }));
    }

    async getAll(): Promise<Rate[]> {
        let result = await this.storageService
            .getDb()
            .query(`SELECT * FROM ${tableName.rate}`);

        return result.values as Rate[];
    }

    private async delete(): Promise<capSQLiteChanges> {
        const sql = `DELETE FROM ${tableName.rate}`;

        return await this.storageService.getDb().execute(sql);
    }
}
