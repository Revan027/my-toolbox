import { Injectable } from '@angular/core';
import { TCGDexCard } from '../models/TCGDexCardPrice';
import { TCGDexService } from './tcg-dex.service';
import { CardService } from './card.service';
import { StatistiqueService } from './statistique.service';

@Injectable({
    providedIn: 'root',
})
export class TCGDexCardService {

    constructor(private TCGDexService: TCGDexService, private cardService: CardService, private statistiqueService: StatistiqueService) {}

    async getPricings(){
        // parcours des cartes par paquet de 100
        let prices: TCGDexCard[] = []
        const limit = 100;
        const countCard = await this.statistiqueService.countTotalAcquiredCard();
        let i = 0

        let progress = 0;

        while(progress != countCard){
            const ids = await this.cardService.getAllAcquiredIDs(limit, i);
            progress += ids.length;
            i++;

            await Promise.all(this.TCGDexService.getCards(ids)).then((result) => {

                result.map((item) => this.TCGDexService.updatePricing(item))
               
                prices  = prices.concat(  result);  
            });

        } 

        return prices;
    }
}

