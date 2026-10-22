import { Component, DestroyRef, inject, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Capacitor } from '@capacitor/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { MOCK_CARDS } from 'src/app/constants/mock-data';
import { PagedCardResult } from 'src/app/models/PagedCardResult';
import { CardService } from 'src/app/services/card.service';
import { FileService } from 'src/app/services/capacitor.services.common/file.service';
import { pageTransition } from 'src/app/animations/page-transition.animation';
import { merge, switchMap } from 'rxjs';
import { CardFilter } from 'src/app/models/CardFilter';

@Component({
    standalone: false,
    selector: 'app-suivi',
    templateUrl: './suivi-tcg.page.html',
    styleUrls: ['./suivi-tcg.page.scss'],
})
export class SuiviTCGPage {
    private destroyRef = inject(DestroyRef);

    protected readonly pageTransition = pageTransition;

    readonly pagedCardResult: Signal<PagedCardResult>;

    protected loaded = signal<boolean>(false);
    protected hasFilter = signal<boolean>(false);

    constructor(private cardService: CardService, private fileService: FileService) 
    {
        this.pagedCardResult = this.cardService.pagedCardResult;

        // on s'abonne pour savoir quand les cartes ont été modifiées
        this.cardService.cardsChanged
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.refreshCards();
            });

        // on s'abonne pour savoir si un trie ou une recherche a été faites
        merge(this.cardService.sortChanged, this.cardService.filterChanged)
            .pipe( 
                switchMap(() => this.getCards()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
    }

    ngOnInit(){     
        this.getCards();
    }

    getSrc(uri: string){  
        return this.fileService.getUrlWeb(uri);
    }

    private async getCards() {
        if (!Capacitor.isNativePlatform()){
            let pagedCardResult = new PagedCardResult();   
            pagedCardResult.cards = MOCK_CARDS;
            pagedCardResult.totalCard = MOCK_CARDS.length;

            this.cardService.setPagedCardResult(pagedCardResult);
        }
        else{
            this.setLoaded(true);

            this.setHasFilter(this.cardService.cardFilter() != undefined);// controle si un filtre est en place
          
            this.cardService.resetPagedCardResult();

            await this.cardService.loadPage(this.cardService.cardFilter() as CardFilter, this.cardService.cardSort());
          
            this.setLoaded(false);
        }       
    }  

    private async refreshCards() {
        await this.cardService.refreshPage(this.cardService.cardFilter() as CardFilter, this.cardService.cardSort()); 
    }  

    async onIonInfinite(event: InfiniteScrollCustomEvent) {
        if (this.loaded())
            return;

        await this.cardService.loadPage(this.cardService.cardFilter() as CardFilter, this.cardService.cardSort());
           
        await event.target.complete();
    }

    setLoaded(value: boolean){
        this.loaded.set(value);
    }

    setHasFilter(value: boolean){
        this.hasFilter.set(value);
    }
}
