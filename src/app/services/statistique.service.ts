import { Injectable, signal } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { Card } from '../models/Card';
import { DataLineChart } from '../models/DataLineChart';
import moment from 'moment';
import { PeriodEnum } from '../constants/PeriodEnum';


@Injectable({
    providedIn: 'root',
})
export class StatistiqueService {  
    private progressionPercentage = signal<number>(0);
    private totalValue = signal<number>(0);

    _progressionPercentage = this.progressionPercentage.asReadonly();
    _totalValue = this.totalValue.asReadonly();

    constructor(private storageService: StorageService) {
        moment.locale('fr');
    }

    private async countCompletionByGeneration(generationID: number, isAcquired: boolean | undefined = undefined): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount
            FROM ${tableName.card} as card
            WHERE ${isAcquired != undefined ? "isAcquired IS ?" : "TRUE"} AND generationID = ?`, isAcquired != undefined ? [isAcquired, generationID] : [generationID]);
        
        return result.values != undefined ? result.values[0].totalCount : 0
    }  
    
    private async countLegendary(isAcquired: boolean | undefined = undefined): Promise<number>{
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

    getCompletionPercentage(currentValue: number, total: number): number{
        return (100 * currentValue) / total;
    }

    private getProgressionPercentage(initValue: number, finalValue: number){
        return ((finalValue - initValue) / initValue) * 100;
    }

    async getProgressionByMonth(currentValue: number){
        const periods = this.getPeriods(PeriodEnum.PREVIOUS_MONTH);
        
        // récupération de la valeur du mois dernier
        let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalCount FROM ${tableName.card}
            WHERE DATE(dateAcquired || '-01') <= ?
            AND isAcquired = 1`, [periods[0]]);
           
        const initValue = result.values != undefined ? result.values[0].totalCount : 0;    
 
        return this.getProgressionPercentage(initValue, currentValue);
    }

    getPeriods(periodEnum: PeriodEnum): string[]{
        let startDate = undefined;
        let endDate = undefined;

        switch(periodEnum) {
            case PeriodEnum.SIX_MONTH:
                startDate = moment().add("-6", "months").format('YYYY-MM-01'); // commencement au 01 du mois
                endDate = moment().format('YYYY-MM-DD'); // fin à la date en cours
                break;
            case PeriodEnum.TWELVE_MONTH:
                startDate = moment().add("-12", "months").format('YYYY-MM-01'); // commencement au 01 du mois
                endDate = moment().format('YYYY-MM-DD'); // fin à la date en cours
                break;
            case PeriodEnum.PREVIOUS_MONTH:
                startDate = moment().add("-1", "months").format('YYYY-MM-01'); // commencement au 01 du mois
                endDate = moment().format('YYYY-MM-DD'); // fin à la date en cours
                break;
            case PeriodEnum.ALL:
                startDate = moment().format('2024-01-01'); // commencement au 01 du mois
                endDate = moment().format('YYYY-MM-DD'); // fin à la date en cours
                break;
        }

        return [startDate, endDate];
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

    async getCompletionLegendary(): Promise<number>{
        const total = await this.countLegendary();
        const currentValue = await this.countLegendary(true);

        return this.getCompletionPercentage(currentValue, total);
    }

    async getCompletionGeneration(generationID: number): Promise<number>{
        const total = await this.countCompletionByGeneration(generationID);
        const currentValue = await this.countCompletionByGeneration(generationID, true);

        return this.getCompletionPercentage(currentValue, total);
    }

    async getCompletionGlobal(): Promise<number>{
        const total = await this.countTotalCard();
        const currentValue = await this.countTotalAcquiredCard();

        return this.getCompletionPercentage(currentValue, total);
    }
    
    async getTotalValueChart(startBegin: string, endBegin: string): Promise<DataLineChart[]>{   
        let startValue = 0;
        // regroupement par mois et calcul de la valeur des cartes du mois
        //WHERE DATE(dateAcquired || '-01') >= ? AND DATE(dateAcquired || '-01') <= ?
  
        // recherche de la valeur de la collection avant la date de début
       let result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalCount FROM ${tableName.card}
            WHERE DATE(dateAcquired || '-01') < ?
            AND isAcquired = 1`, [startBegin]);

        startValue = result.values != undefined ? result.values[0].totalCount : 0;

        result = await this.storageService.getDb().query(`
            SELECT SUM(averagePrice) as totalCount, dateAcquired as libelle  FROM ${tableName.card}
            WHERE DATE(dateAcquired || '-01') >= ? AND DATE(dateAcquired || '-01') <= ?
            AND isAcquired = 1
            GROUP BY dateAcquired`, [startBegin, endBegin]);
        
        const values: any[] = result.values ?? [];
        let previousValue = startValue;

        // parcours des mois et ajout de la valeur précédente à la valeur en cours pour avoir une progression total
        for(let value of values){
            value.totalCount = (Math.round((value.totalCount + previousValue) * 100) / 100); // on arrondie pour éviter des chiffres infinie du a sql lite

            previousValue = value.totalCount;
            value.libelle = moment(value.libelle).format('MM/YY');
        }

        const lines: DataLineChart[] = values?.map((data: any)=>{
            return DataLineChart.fromSQL(data);
        })|| []; 

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

    async resfreshMetricBanner(){
        const totalValue = await this.countTotalValue();

        this.setTotalValue(totalValue);
        this.setProgressionPercentage(await this.getProgressionByMonth(totalValue));
    }

    setProgressionPercentage(value: number){
        this.progressionPercentage.set(value)
    }

    setTotalValue(value: number){
        this.totalValue.set(value)
    } 
}
