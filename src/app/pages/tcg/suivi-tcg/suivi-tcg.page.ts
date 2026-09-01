import { Component, DestroyRef, effect, inject, Signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Capacitor } from '@capacitor/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { MOCK_CARDS } from 'src/app/constants/mock-data';
import { PagedCardResult } from 'src/app/models/PagedCardResult';
import { CardService } from 'src/app/services/card.service';
import { ResumeService } from 'src/app/services/resume.service';
import { FileService } from 'src/app/services/file.services.common/file.service';
import { pageTransition } from 'src/app/animations/page-transition.animation';
import { merge, switchMap } from 'rxjs';

@Component({
    standalone: false,
    selector: 'app-suivi',
    templateUrl: './suivi-tcg.page.html',
    styleUrls: ['./suivi-tcg.page.scss'],
})
export class SuiviTCGPage {
    private destroyRef = inject(DestroyRef);

    protected readonly pageTransition = pageTransition;

    readonly totalCard: Signal<number>;
    readonly totalValue: Signal<number>;
    readonly pagedCardResult: Signal<PagedCardResult>;

    loaded: boolean = false;
    percentageCompletion: number = 0;

    constructor(private cardService: CardService, private fileService: FileService, private resumeService: ResumeService) 
    {
        this.totalCard = this.resumeService.totalCard;
        this.totalValue = this.resumeService.totalValue;
        this.pagedCardResult = this.cardService.pagedCardResult;

        // on s'abonne pour savoir quand les cartes ont été modifiées
        this.cardService.cardsChanged
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
            this.refreshSearch();
        });

        // on s'abonne pour savoir si un trie ou une recherche a été faites
        merge(this.cardService.sortChanged, this.cardService.filterChanged)
        .pipe( 
            switchMap(() => this.search()),
            takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }

    ngOnInit(){
        this.search();
    }

    getSrc(uri: string){  
        return this.fileService.getSrcWeb(uri);
    }

    private async search() {
        if (!Capacitor.isNativePlatform()){
            let pagedCardResult = new PagedCardResult();   
            pagedCardResult.cards = MOCK_CARDS;
            pagedCardResult.totalCount = MOCK_CARDS.length;

            this.cardService.loadPagedCardResult(pagedCardResult);
        }
        else{
            this.loaded = true;

            this.resumeService.loadResume();

            this.cardService.resetPagedCardResult();

            await this.cardService.loadNextPage();

            this.loaded = false;
        }       
    }  

    private async refreshSearch() {
        this.resumeService.loadResume();

        await this.cardService.refreshPage();
    }  

    async onIonInfinite(event: InfiniteScrollCustomEvent) {
        if (this.loaded)
            return;

        await this.cardService.loadNextPage();
           
        await event.target.complete();
    }
}
