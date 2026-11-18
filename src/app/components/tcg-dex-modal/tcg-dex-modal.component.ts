import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TCGDexService } from 'src/app/services/tcg-dex.service';

@Component({  
  standalone: false,
  selector: 'app-tcg-dex-modal',
  templateUrl: './tcg-dex-modal.component.html',
  styleUrls: ['./tcg-dex-modal.component.scss'],
})
export class TcgDexModalComponent { 
  private destroyRef = inject(DestroyRef);

  apiID = output<string>();

  protected isLoading = signal<boolean>(false);
  protected cards = signal<any>(undefined);
  protected selectedCard = signal<any>(undefined);

  constructor(private TCGDexService: TCGDexService) {}
  
  onModalPresent(){
    this.setIsLoading(true);

    this.TCGDexService.searchCard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.setCards(result); 

        this.setIsLoading(false);
      });
  }

  onModalDismiss(){
    this.setIsLoading(false);
    this.setSelectedCard(undefined); 
    this.setCards(undefined);
  }

  onClickCard(card: any){
    this.setSelectedCard(card);

    this.apiID.emit(card.id); 
  }

  setIsLoading(value: boolean){
    this.isLoading.set(value);
  }

  setCards(value: any){
    this.cards.set(value);
  }

  setSelectedCard(value: any){
    this.selectedCard.set(value);
  }
}
