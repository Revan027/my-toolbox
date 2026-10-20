import { Injectable } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { Card } from '../models/Card';
import { DataLineChart } from '../models/DataLineChart';
import moment from 'moment';


@Injectable({
    providedIn: 'root',
})
export class StatistiqueService {   
    constructor(private storageService: StorageService) {
        moment.locale('fr');
    }

    async getPeriod(){
        let results:string[] = [];
        //les 12 derniers mois

        let startDate = moment().add("-12", "months").format('YYYY-MM-01');
        let endDate = moment().format('YYYY-MM-DD');
         //les 6 derniers mois
        startDate = moment().add("-3", "years").format('YYYY-MM-01');
        endDate = moment().format('YYYY-MM-DD');
        await this.getTotalValueChart(startDate,endDate )
        return results;
    }

    async getMostExpensiveCard(): Promise<Card[]>{
        let result = await this.storageService.getDb().query(`
            SELECT card.name, card.srcPicture, card.averagePrice, serie.name as serie_name FROM ${tableName.card} as card
            INNER JOIN ${tableName.generation} AS generation ON ${tableName.generation}.id = generationID
            INNER JOIN ${tableName.serie} AS serie ON ${tableName.serie}.id = card.serieId
            ORDER BY averagePrice DESC LIMIT 6`);
        
        const cards: Card[] = result.values?.map((data: any)=>{
            return Card.fromSQL(data);
        })|| [];   

        return cards;
    }

    async countCompletionByGeneration(generationID: number, isAcquired: boolean | undefined = undefined): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount
            FROM ${tableName.card} as card
            WHERE ${isAcquired != undefined ? "isAcquired IS ?" : "TRUE"} AND generationID = ?`, isAcquired != undefined ? [isAcquired, generationID] : [generationID]);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }  
    
    async countLegendary(isAcquired: boolean | undefined = undefined): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount
            FROM ${tableName.card} as card
            WHERE ${isAcquired != undefined ? "isAcquired IS ?" : "TRUE"} AND isLegendary = 1`, isAcquired != undefined ? [isAcquired] : []);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }
    
    async countTotalValue(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalCount FROM ${tableName.card}`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    async countTotalCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount FROM ${tableName.card}`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    async countTotalMissingCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount FROM ${tableName.card} 
            WHERE isAcquired IS FALSE`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    async countTotalAcquiredCard(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount FROM ${tableName.card} 
            WHERE isAcquired IS TRUE`);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }

    getAveragePrice(totalValue: number, totalCard: number): number{
        return totalValue / totalCard;
    }

    getPercentageCompletion(currentValue: number, total: number): number{
        return (100 * currentValue) / total;
    }

    async getCompletionLegendary(): Promise<number>{
        const total = await this.countLegendary();
        const currentValue = await this.countLegendary(true);

        return this.getPercentageCompletion(currentValue, total);
    }

    async getCompletionGeneration(generationID: number): Promise<number>{
        const total = await this.countCompletionByGeneration(generationID);
        const currentValue = await this.countCompletionByGeneration(generationID, true);

        return this.getPercentageCompletion(currentValue, total);
    }

    async getCompletionGlobal(): Promise<number>{
        const total = await this.countTotalCard();
        const currentValue = await this.countTotalAcquiredCard();

        return this.getPercentageCompletion(currentValue, total);
    }
    
    async getTotalValueChart(startBegin: string, endBegin: string): Promise<DataLineChart[]>{   
        // regroupement par mois et calcul de la valeur des cartes du mois
        let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalCount, dateAcquired as libelle  FROM ${tableName.card}
            WHERE DATE(dateAcquired || '-01') >= ? AND DATE(dateAcquired || '-01') <= ?
            AND isAcquired = 1
            GROUP BY dateAcquired`, [startBegin, endBegin]);
        
        const values: any[] = result.values ?? [];
        let previousValue = 0;

        // parcours des mois et ajout de la valeur précédente à la valeur en cours pour avoir une progression total
        for(let value of values){
            value.totalCount = (Math.round((value.totalCount + previousValue) * 100) / 100); // on arrondiee pour éviter des chiffres infinie du a sql lite

            previousValue = value.totalCount;
            value.libelle = moment(value.libelle).format('MM/YY');
        }

        const lines: DataLineChart[] = values?.map((data: any)=>{
            return DataLineChart.fromSQL(data);
        })|| []; 

       // alert(JSON.stringify(values, null, 2));
        return lines;
    }

    async getCategoryChart(): Promise<DataLineChart[]>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount, 
            CASE 
                WHEN card.isLegendary == 1 THEN 'Pokémon légendaire' 
                ELSE 'Pokémon non légendaire' 
            END AS libelle      
            FROM ${tableName.card} as card 
            WHERE isAcquired = 1
            GROUP BY isLegendary`);
        
        const lines: DataLineChart[] = result.values?.map((data: any)=>{
            return DataLineChart.fromSQL(data);
        })|| [];   

        return lines;
    } 

    async getAcquisitionChart(): Promise<DataLineChart[]>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount, 
            CASE 
                WHEN card.isAcquired == 1 THEN 'Acquise' 
                ELSE 'Non acquise' 
            END AS libelle 
            FROM ${tableName.card} as card
            GROUP BY isAcquired`);
        
        const lines: DataLineChart[] = result.values?.map((data: any)=>{
            return DataLineChart.fromSQL(data);
        })|| [];   

        return lines;
    }   
}
