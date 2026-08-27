import { Injectable } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { CardService } from './card.service';

@Injectable({
    providedIn: 'root',
})
export class ResumeService {    
   
    constructor(private storageService: StorageService, private cardService: CardService) {}

    async countTotalValue(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalValue 
            FROM ${tableName.card}
            ${this.cardService.getQuerySearch(this.cardService.cardFilter())}`);
        
        return result.values != undefined ? result.values[0].totalValue : 0
    }

    async countTotalCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCard
            FROM ${tableName.card}
            ${this.cardService.getQuerySearch(this.cardService.cardFilter())}`);

        return result.values != undefined ? result.values[0].totalCard : 0
    }
}
