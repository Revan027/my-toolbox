import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from './file.services.common/file.service';
import { StorageService } from './storage.services.common/storage-service';
import { GenerationService } from './generation.service';
import { SerieService } from './serie.service';
import { CardConditionService } from './card-condition.service';
import { ExchangeRateService } from './exchange-rate.service';
import { StatistiqueService } from './statistique.service';

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
    private statistiqueService: StatistiqueService,
    ) { }
  
  async init(): Promise<void>{
    await this.fileService.loadDocumentsUri(""); // On init l'uri vers le répertoire Documents qui ne bouchera pas
    await this.storageService.initPlugin(); // On init la base de donné au démarrage de l'application

    const p1 = this.generationService.getAll();
    const p2 = this.serieService.getAll();
    const p3 = this.cardConditionService.getAll();
    const p4 = this.exchangeRateService.getCurrencies();
    const p5 = this.exchangeRateService.getRates();
    const p6 = this.statistiqueService.countTotalValue();
this._isAppInit.set(true);
      this.router.navigateByUrl('tcg');
    // on attend la résolution des promises
    Promise.all([p1, p2, p3, p4, p5, p6]).then( async (values) => {   
      this.generationService.set(values[0]);
      this.serieService.set(values[1]);
      this.cardConditionService.set(values[2]);
      this.exchangeRateService.setCurrency(values[3]);
      this.exchangeRateService.setRates(values[4]);
      this.statistiqueService.setTotalValue(values[5]);

      this.statistiqueService.setProgressionPercentage(await this.statistiqueService.getProgressionByMonth(values[5]));

      this._isAppInit.set(true);
      this.router.navigateByUrl('tcg');
    })
  }
}
 