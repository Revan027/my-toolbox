import { Injectable, signal } from '@angular/core';
import { TCGDexService } from './tcg-dex.service';
import { CardService } from './card.service';
import { StatistiqueService } from './statistique.service';
import { tableName } from '../constants/table-names';
import { CardPricePeriod } from '../models/CardPricePeriod';
import { StorageService } from './capacitor.services.common/storage-service';
import moment from 'moment';
import { CardPricing } from '../models/CardPricing';
import { ToastService } from './ionic.services.common/toast.service';
import { StatusEnum } from './ionic.services.common/enum/status.enum';
import { Subject } from 'rxjs';
import { Card } from '../models/Card';

@Injectable({
    providedIn: 'root',
})
export class CardPricingService {
    private _pricingChanged$ = new Subject<void>();

    private daysPastUpdated = signal<number>(0);

    readonly pricingChanged = this._pricingChanged$.asObservable(); 

    _daysPastUpdated = this.daysPastUpdated.asReadonly();

    constructor(
        private TCGDexService: TCGDexService, 
        private cardService: CardService, 
        private statistiqueService: StatistiqueService,
        private storageService: StorageService,
        private toastService: ToastService) 
    {
        moment.locale('fr');
    }

    async updatePricings(){      
        const limit = 100;
        let cards: Card[] = [];
        let i = 0
        let cardPricePeriod = new CardPricePeriod();
        cardPricePeriod.date = moment().format("YYYY-MM-DD");
        cardPricePeriod.period = moment().format("YYYY-MM");
        cardPricePeriod.prices = [];

        // suppression des cotes dont la carte n'est plus en base
        await this.deleteExpired();

        // recuperation des cotes des cartes via l'api
        do{
            cards = await this.cardService.getAcquiredPaged(limit, i, cardPricePeriod.period);

            i++;
   
            // mise en parallèle des paquets de requetes api par ids
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
        }while(cards.length > 0);

        if(cardPricePeriod.prices.length == 0){
            await this.toastService.get(`Aucune cote à mettre à jour sur cette période`, StatusEnum.Success);

            return;
        }
        
        const success = await this.create(cardPricePeriod);
    
        return success 
            ? await this.toastService.get(`Mise à jour de ${cardPricePeriod.prices.length} cotes`, StatusEnum.Success)
            : await this.toastService.get(`Une erreur est survenue`, StatusEnum.Danger);
    }

    async create(cardPricePeriod: CardPricePeriod){
        let success = true;
        let sql = "";
        let result;
        const currentPeriod = await this.getByPeriod(cardPricePeriod.period);
        let cardHistoryPeriodID = currentPeriod.id;

        // création de la période si elle n'existe pas deja
        if(currentPeriod.id == 0){
            sql = `
                INSERT INTO ${tableName.cardHistoryPeriod} (date, period) 
                VALUES (?, ?)`;

            result = await this.storageService.getDb().run(sql, 
            [
                cardPricePeriod.date, cardPricePeriod.period
            ]);

            cardHistoryPeriodID = result?.changes?.lastId ?? 0;

            success = cardHistoryPeriodID != undefined && cardHistoryPeriodID > 0;
        }

        // création des cotes
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

    async deleteCardHistoryPeriod(){
        const sql = `DELETE FROM ${tableName.cardHistoryPeriod}`;

        const result = await this.storageService.getDb().execute(sql);

        return result;
    }

    async deleteCardHistoryPricing(){
        const sql = `DELETE FROM ${tableName.cardHistoryPricing}`;

        const result = await this.storageService.getDb().execute(sql);

        return result;
    }

    async deleteExpired() {
        /*await this.deleteCardHistoryPricing();
        await this.deleteCardHistoryPeriod();*/
        const sql = `
            DELETE FROM ${tableName.cardHistoryPricing}
            WHERE NOT EXISTS (
                SELECT 1
                FROM ${tableName.card} AS card
                WHERE card.id = ${tableName.cardHistoryPricing}.cardID
            );`;

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

    notifyPricingChanged(): void {
        this._pricingChanged$.next();
    }
}

