import { Component, DestroyRef, effect, inject, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Capacitor } from '@capacitor/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { pageTransition } from 'src/app/animations/page-transition.animation';
import { MOCK_CARDS } from 'src/app/constants/mock-data';
import { PagedCardResult } from 'src/app/models/PagedCardResult';
import { CardService } from 'src/app/services/entities/card-service';
import { FileService } from 'src/app/services/file.services.common/file.service';


@Component({
    standalone: false,
    selector: 'app-suivi',
    templateUrl: './suivi-tcg.page.html',
    styleUrls: ['./suivi-tcg.page.scss'],
})
export class SuiviTCGPage {
    private destroyRef = inject(DestroyRef);

    slideForward = pageTransition;

    pagedCardResult = this.cardService.pagedCardResult;

    loaded: boolean = false;

    constructor(private cardService: CardService, private fileService: FileService) 
    {
        this.cardService.hasCardsChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (hasCardsChanged: boolean) => {
            if (hasCardsChanged){
                await this.search();
            }
        });

        effect(() => {
            const sort = this.cardService.cardSort();
            const filter = this.cardService.cardFilter();

            untracked(async () => await this.search()) // on track pas les interactions avec d'autre signaux faites dedans pour ne pas réveiller le effect          
        });
    }

    getSrc(uri: string){  
        return this.fileService.getSrcWeb(uri);
    }

    async onIonInfinite(event: InfiniteScrollCustomEvent) {
        if (this.loaded)
            return;

        await this.cardService.loadNextPage();
           
        await event.target.complete();
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

            this.cardService.resetPagedCardResult();

            await this.cardService.loadNextPage();

            this.loaded = false;
        }       
    }  
}
