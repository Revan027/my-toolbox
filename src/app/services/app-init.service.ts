import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from './file.services.common/file.service';
import { StorageService } from './storage.services.common/storage-service';
import { GenerationService } from './generation.service';
import { SerieService } from './serie.service';
import { CardConditionService } from './card-condition.service';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  private _isAppInit = signal<boolean>(false);

  readonly isAppInit = this._isAppInit.asReadonly();

  constructor(
    private router: Router,
    private fileService: FileService,
    private storageService: StorageService,
    private cardConditionService: CardConditionService,
    private serieService: SerieService,
    private exchangeRateService: ExchangeRateService,
    private generationService: GenerationService,
    ) { }
  
  async init(): Promise<void>{
    await this.fileService.loadDocumentsUri(""); // On init l'uri vers le répertoire Documents qui ne bouchera pas
    await this.storageService.initPlugin(); // On init la base de donné au démarrage de l'application

    const p1 = this.generationService.getAll();
    const p2 = this.serieService.getAll();
    const p3 = this.cardConditionService.getAll();
    const p4 = this.exchangeRateService.getCurrencies();
    const p5 = this.exchangeRateService.getRates();

    // on attend la résolution des promises
    Promise.all([p1, p2, p3, p4, p5]).then((values) => {    
      this.generationService.load(values[0]);
      this.serieService.load(values[1]);
      this.cardConditionService.load(values[2]);
      this.exchangeRateService.loadCurrencies(values[3]);
      this.exchangeRateService.loadRates(values[4]);

      this._isAppInit.set(true);
      this.router.navigateByUrl('tcg');
    })
  }
}
 