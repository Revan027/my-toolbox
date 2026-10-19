import { Injectable } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { Card } from '../models/Card';
import { Capacitor } from '@capacitor/core';
import { MOCK_CARDS } from 'src/app/constants/mock-data';
import { DataLineChart } from '../models/DataLineChart';


@Injectable({
    providedIn: 'root',
})
export class StatistiqueService {   
    constructor(private storageService: StorageService) {}

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

    async getCategoryChart(): Promise<DataLineChart[]>{
        if (!Capacitor.isNativePlatform()){
            const legendaryCount = MOCK_CARDS.filter((card) => card.isLegendary).length;

            return [
                DataLineChart.fromSQL({ totalCount: MOCK_CARDS.length - legendaryCount, name: 'Pokémon non légendaire' }),
                DataLineChart.fromSQL({ totalCount: 5, name: 'Pokémon légendaire' }),
            ];
        }

        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount, 
            CASE 
                WHEN card.isLegendary == 1 THEN 'Pokémon légendaire' 
                ELSE 'Pokémon non légendaire' 
            END AS name      
            FROM ${tableName.card} as card 
            WHERE isAcquired = 1
            GROUP BY isLegendary`);
        
        const lines: DataLineChart[] = result.values?.map((data: any)=>{
            return DataLineChart.fromSQL(data);
        })|| [];   
        //alert(JSON.stringify(result.values, null, 2));
        return lines;
    } 
    
    async getAcquisitionChart(): Promise<DataLineChart[]>{
        if (!Capacitor.isNativePlatform()){
            const legendaryCount = MOCK_CARDS.filter((card) => card.isLegendary).length;

            return [
                DataLineChart.fromSQL({ totalCount: MOCK_CARDS.length - legendaryCount, name: 'Pokémon non légendaire' }),
                DataLineChart.fromSQL({ totalCount: 5, name: 'Pokémon légendaire' }),
            ];
        }

        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as totalCount, 
            CASE 
                WHEN card.isAcquired == 1 THEN 'Acquise' 
                ELSE 'Non acquise' 
            END AS name 
            FROM ${tableName.card} as card
            GROUP BY isAcquired`);
        
        const lines: DataLineChart[] = result.values?.map((data: any)=>{
            return DataLineChart.fromSQL(data);
        })|| [];   
        //alert(JSON.stringify(result.values, null, 2));
        return lines;
    }   
}
