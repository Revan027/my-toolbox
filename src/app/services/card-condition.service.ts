import { Injectable, signal } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { CardCondition } from 'src/app/models/CardCondition';
import { MOCK_CARD_CONDITIONS } from 'src/app/constants/mock-data';
import { StorageService } from './storage.services.common/storage-service';
import { Capacitor } from '@capacitor/core';

@Injectable({
    providedIn: 'root',
})
export class CardConditionService {
    private _cardConditions= signal<CardCondition[]>([]);
    readonly cardConditions = this._cardConditions.asReadonly();

    constructor(private storageService: StorageService) {}

    async getAll() {
        if (Capacitor.isNativePlatform()){
            let result = await this.storageService
                .getDb()
                .query(`SELECT * FROM ${tableName.cardCondition}`);

            return result.values as CardCondition[];
        }
        
        return MOCK_CARD_CONDITIONS;
    }

    load(cardConditions: CardCondition[]){
        this._cardConditions.set(cardConditions);
    }
}
