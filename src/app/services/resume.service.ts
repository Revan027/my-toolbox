import { Injectable, signal } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { CardService } from './card.service';

@Injectable({
    providedIn: 'root',
})
export class ResumeService {    
    private _totalValue = signal<number>(0);
    private _totalCard = signal<number>(0);
    
    readonly totalValue = this._totalValue.asReadonly();
    readonly totalCard = this._totalCard.asReadonly();

    constructor(private storageService: StorageService, private cardService: CardService) {}

    async loadResume(): Promise<void>{
        const promises = await Promise.all([
            this.countTotalCard(),
            this.countTotalValue(),
        ]);

        this.loadTotalCard(promises[0]);
        this.loadTotalValue(promises[1]);
    }
    
    private async countTotalValue(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalValue 
            FROM ${tableName.card}
            ${this.cardService.getQuerySearch(this.cardService.cardFilter())}`);
        
        return result.values != undefined ? result.values[0].totalValue : 0
    }

    private async countTotalCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCard
            FROM ${tableName.card}
            ${this.cardService.getQuerySearch(this.cardService.cardFilter())}`);

        return result.values != undefined ? result.values[0].totalCard : 0
    }
   
    loadTotalValue(value: number){
        this._totalValue.set(value);
    }

    loadTotalCard(value: number){
        this._totalCard.set(value);
    }
}
