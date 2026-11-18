import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './capacitor.services.common/http-service';
import { TCGDexCard } from '../models/TCGDexCard';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TCGDexService {

    constructor(private httpService: HttpService) {}

    searchCard(cardName: string): Observable<TCGDexCard[]>{
        const url = environment.apiTCGDexBaseUrl + "cards";

        return this.httpService.get<TCGDexCard[]>(url, {name: cardName});
    }
}
