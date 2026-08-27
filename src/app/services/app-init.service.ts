import { DestroyRef, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from './file.services.common/file.service';
import { StorageService } from './storage.services.common/storage-service';
import { GenerationService } from './generation.service';
import { SerieService } from './serie.service';
import { CardConditionService } from './card-condition.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  isAppInit = signal<boolean>(false);

  constructor(
    private router: Router,
    private destroyRef: DestroyRef,
    private fileService: FileService,
    private storageService: StorageService,
    private cardConditionService: CardConditionService,
    private serieService: SerieService,
    private generationService: GenerationService,
    ) { }
  
  async init(): Promise<void>{
    await this.fileService.getDocumentsUri(""); // On init l'uri vers le répertoire Documents qui ne bouchera pas
    await this.storageService.initPlugin(); // On init la base de donné au démarrage de l'application

    const p1 = this.generationService.getAll();
    const p2 = this.serieService.getAll();
    const p3 = this.cardConditionService.getAll();

    // on attend la résolution des promises
    Promise.all([p1, p2, p3]).then((values) => {    
      this.generationService.load(values[0]);
      this.serieService.load(values[1]);
      this.cardConditionService.load(values[2]);

      this.isAppInit.set(true);
      this.router.navigateByUrl('tcg');
    })
  }
}
 