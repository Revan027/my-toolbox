import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpService } from './capacitor.services.common/http-service';

@Injectable({
    providedIn: 'root',
})
export class TCGDexService {

    constructor(private httpService: HttpService) {}

    searchCard(){
        const url = environment.apiTCGDexBaseUrl + "cards";
        return this.httpService.get(url, {name: "Entei"});
    }
}
