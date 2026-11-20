import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './capacitor.services.common/http-service';
import { firstValueFrom, Observable } from 'rxjs';
import { TCGDexCardLight } from '../models/TCGDexCard';
import { CardmarketPricing, TCGDexCard, TCGDexPricing } from '../models/TCGDexCardPrice';
import { CardService } from './card.service';

@Injectable({
    providedIn: 'root',
})
export class TCGDexService {

    constructor(private httpService: HttpService, private cardService: CardService) {}

    searchCard(cardName: string): Observable<TCGDexCardLight[]>{
        return this.httpService.get<TCGDexCardLight[]>(`${environment.apiTCGDexBaseUrl}/fr/cards`, {name: cardName.trim()});
    }

    getCard(id: number, language: string = "fr"): Observable<TCGDexCard>{
        return this.httpService.get<TCGDexCard>(`${environment.apiTCGDexBaseUrl}${language}/cards/${id}`);
    }

    getCards(ids: number[]): Promise<TCGDexCard>[]{
        let result: Promise<TCGDexCard>[] = []

        ids.map((id: number) => {
            result.push(firstValueFrom(this.getCard(id))
                .catch((e) => firstValueFrom(this.getCard(id, "en"))))
        })   

        return result;
    }

    async updatePricing(cardApi: any){

        if(cardApi.pricing.cardmarket  == undefined){
            let variant = cardApi.variants_detailed.find((x: any) => x.pricing?.cardmarket != undefined)

            cardApi.pricing = new TCGDexPricing();
            cardApi.pricing.cardmarket = new CardmarketPricing();

            if(variant == undefined){ // carte n'ayant aucune cote
                cardApi.pricing.cardmarket.avg30 = (await this.cardService.getByApiId(cardApi.id)).averagePrice;             
            }
            else{ // carte ayant une cote dans un variant mais pas dans l'objet principale
                cardApi.pricing.cardmarket.avg30 = variant.pricing.cardmarket.avg30;
                cardApi.pricing.cardmarket.updated = variant.pricing.cardmarket.updated;
            } 
        }  
    }
}
