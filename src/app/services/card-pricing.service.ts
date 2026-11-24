import { Injectable, signal } from '@angular/core';
import { TCGDexService } from './tcg-dex.service';
import { CardService } from './card.service';
import { StatistiqueService } from './statistique.service';
import { tableName } from '../constants/table-names';
import { CardPricePeriod } from '../models/CardPricePeriod';
import { StorageService } from './capacitor.services.common/storage-service';
import moment from 'moment';
import { CardPricing } from '../models/CardPricing';

@Injectable({
    providedIn: 'root',
})
export class CardPricingService {
    private daysPastUpdated = signal<number>(0);
    _daysPastUpdated = this.daysPastUpdated.asReadonly();

    constructor(
        private TCGDexService: TCGDexService, 
        private cardService: CardService, 
        private statistiqueService: StatistiqueService,
        private storageService: StorageService) 
    {
        moment.locale('fr');
    }

    async updatePricings(){      
        let cardPricePeriod = new CardPricePeriod();
        cardPricePeriod.date = moment().format("YYYY-MM-DD");
        cardPricePeriod.period = moment().format("YYYY-MM");
        cardPricePeriod.prices = [];

        const limit = 100;
        const countCard = await this.statistiqueService.countTotalAcquiredCard();
        let i = 0
        let progress = 0;

        // recupe des cotes des cartes via l'api
        while(progress != countCard){
            const cards = await this.cardService.getPagedAcquired(limit, i);
            progress += cards.length;
            i++;

            await Promise
                .all(this.TCGDexService.getCards(cards.map((card) => card.apiID) as []))
                .then((result) => {
                    // on applique un correctif sur des cotes incohérentes
                    result.map((item) => this.TCGDexService.updatePricing(item));

                    const cardPricings = result.map((tcgDexCard) => { 
                        let cardPricing = new CardPricing();
                        cardPricing.amount = tcgDexCard.pricing?.cardmarket?.avg30 ?? 0;
                        cardPricing.cardID = cards.find((card) => card.apiID == tcgDexCard.id)?.id as number;
 
                        return cardPricing;
                    });
               
                    cardPricePeriod.prices = cardPricePeriod.prices.concat(cardPricings);  
            });
        } 

        const currentPeriod = await this.getByPeriod(cardPricePeriod.period);

        // on supprime les anciennes cotes de la période en cours
        if(currentPeriod.id > 0){
            await this.deleteCardHistoryPricing(currentPeriod.id); 
            await this.deleteCardHistoryPeriod(cardPricePeriod.period);
        }

        await this.create(cardPricePeriod);
    }

    async create(cardPricePeriod: CardPricePeriod){
        let success = false;

        let sql = `
            INSERT INTO ${tableName.cardHistoryPeriod} (date, period) 
            VALUES (?, ?)`;

        let result = await this.storageService.getDb().run(sql, 
        [
            cardPricePeriod.date, cardPricePeriod.period
        ]);

        const cardHistoryPeriodID = result.changes?.lastId;

        success = cardHistoryPeriodID != undefined && cardHistoryPeriodID > 0;

        for(let item of cardPricePeriod.prices){
            sql = `
                INSERT INTO ${tableName.cardHistoryPricing} (cardID, cardHistoryPeriodID, amount) 
                VALUES (?, ?, ?)`;

            result = await this.storageService.getDb().run(sql, 
            [
                item.cardID, cardHistoryPeriodID, item.amount,
            ]);

            success = success && result.changes?.lastId != undefined && result.changes?.lastId > 0;
        }
        
        return success;
    }

    async deleteCardHistoryPeriod(period: string){
        const sql = `DELETE FROM ${tableName.cardHistoryPeriod} WHERE period = ${period}`;

        const result = await this.storageService.getDb().execute(sql);

        return result;
    }

     async deleteCardHistoryPricing(cardHistoryPeriodID: number){
        const sql = `DELETE FROM ${tableName.cardHistoryPricing} WHERE cardHistoryPeriodID = ${cardHistoryPeriodID}`;

        const result = await this.storageService.getDb().execute(sql);

        return result;
    }

    async getByPeriod(periodDate: string): Promise<CardPricePeriod> {
        let result = await this.storageService.getDb().query(`
            SELECT id, period, date
            FROM ${tableName.cardHistoryPeriod}
            WHERE period = '${periodDate}'           
            LIMIT 1;
        `);

        return result.values != undefined && result.values.length > 0 ? result.values[0] as CardPricePeriod : new CardPricePeriod();
    }

    async getDaysPastUpdated(): Promise<number> {
        // diff de la période actuelle et de la dernière enregistrée
        let result = await this.storageService.getDb().query(`
            SELECT id, period, date
            FROM ${tableName.cardHistoryPeriod}
            ORDER BY date DESC       
            LIMIT 1;
        `);

        const cardPricePeriod = result.values != undefined && result.values.length > 0 ? result.values[0] as CardPricePeriod : new CardPricePeriod();
        const duration = moment().diff(cardPricePeriod.date);
  
        return Math.trunc(moment.duration(duration, 'milliseconds').asDays());
    }

    setDaysPastUpdated(value: number){
        this.daysPastUpdated.set(value);
    }
}

