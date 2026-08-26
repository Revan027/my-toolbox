import { Injectable } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {    
   
    constructor(private storageService: StorageService) {}

    async countTotalValue(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalValue FROM ${tableName.card}`);
        
        return result.values != undefined ? result.values[0].totalValue : 0
    }

    async countTotalCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCard FROM ${tableName.card}`);
        
        return result.values != undefined ? result.values[0].totalCard : 0
    }

    async countTotalMissingCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalMissingCard FROM ${tableName.card} 
            WHERE isAcquired IS FALSE`);
        
        return result.values != undefined ? result.values[0].totalMissingCard : 0
    }

    async countTotalAcquiredCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalAcquiredCard FROM ${tableName.card} 
            WHERE isAcquired IS TRUE`);
        
        return result.values != undefined ? result.values[0].totalAcquiredCard : 0
    }

    getAveragePrice(totalValue: number, totalCard: number): number{
        return totalValue / totalCard;
    }

    getPercentageCompletion(totalAcquiredCard: number, totalCard: number): number{
        return (100 * totalAcquiredCard) / totalCard;
    }
}
