import { Component, DestroyRef, effect, inject, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Capacitor } from '@capacitor/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { MOCK_CARDS } from 'src/app/constants/mock-data';
import { PagedCardResult } from 'src/app/models/PagedCardResult';
import { CardService } from 'src/app/services/card.service';
import { ResumeService } from 'src/app/services/resume.service';
import { FileService } from 'src/app/services/file.services.common/file.service';
import { pageTransition } from 'src/app/animations/page-transition.animation';

@Component({
    standalone: false,
    selector: 'app-suivi',
    templateUrl: './suivi-tcg.page.html',
    styleUrls: ['./suivi-tcg.page.scss'],
})
export class SuiviTCGPage {
    private destroyRef = inject(DestroyRef);

    protected readonly pageTransition = pageTransition;

    pagedCardResult = this.cardService.pagedCardResult;

    loaded: boolean = false;
    totalCard: number = 0;
    totalValue: number = 0;
    percentageCompletion: number = 0;

    constructor(private cardService: CardService, private fileService: FileService, private resumeService: ResumeService) 
    {
        this.cardService.cardsChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.search();
        });

        effect(() => {
            const sort = this.cardService.cardSort();
            const filter = this.cardService.cardFilter();

            untracked(async () => await this.search()) // on track pas les interactions avec d'autre signaux faites dedans pour ne pas réveiller le effect          
        });
    }

    private async initResumeSearch(){
        const promises = await Promise.all([
            this.resumeService.countTotalCard(),
            this.resumeService.countTotalValue(),
        ]);
        this.totalCard = promises[0];
        this.totalValue = promises[1];
    }

    getSrc(uri: string){  
        return this.fileService.getSrcWeb(uri);
    }

    private async search() {
        if (!Capacitor.isNativePlatform()){
            let pagedCardResult = new PagedCardResult();   
            pagedCardResult.cards = MOCK_CARDS;
            pagedCardResult.totalCount = MOCK_CARDS.length;

            this.cardService.setPagedCardResult(pagedCardResult);
        }
        else{
            this.loaded = true;

            this.initResumeSearch();

            this.cardService.resetPagedCardResult();

            await this.cardService.loadNextPage();

            this.loaded = false;
        }       
    }  

    async onIonInfinite(event: InfiniteScrollCustomEvent) {
        if (this.loaded)
            return;

        await this.cardService.loadNextPage();
           
        await event.target.complete();
    }
}
