import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TCGDexCard } from 'src/app/models/TCGDexCard';
import { TCGDexService } from 'src/app/services/tcg-dex.service';

@Component({  
  standalone: false,
  selector: 'app-tcg-dex-modal',
  templateUrl: './tcg-dex-modal.component.html',
  styleUrls: ['./tcg-dex-modal.component.scss'],
})
export class TcgDexModalComponent { 
  private destroyRef = inject(DestroyRef);

  cardName = input.required<string>();
  apiID = output<string>();

  protected isLoading = signal<boolean>(false);
  protected cards = signal<TCGDexCard[]>([]);
  protected selectedCard = signal<TCGDexCard>(new TCGDexCard());

  constructor(private TCGDexService: TCGDexService) {}
  
  onModalPresent(){
    this.setIsLoading(true);

    this.TCGDexService.searchCard(this.cardName())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.setCards(Object.values(result));

        this.setIsLoading(false);
      });
  }

  onModalDismiss(){
    this.setIsLoading(false);
    this.setSelectedCard(new TCGDexCard()); 
    this.setCards([]);
  }

  onClickCard(card: any){
    this.setSelectedCard(card);

    this.apiID.emit(card.id); 
  }

  setIsLoading(value: boolean){
    this.isLoading.set(value);
  }

  setCards(value: TCGDexCard[]){
    this.cards.set(value);
  }

  setSelectedCard(value: TCGDexCard){
    this.selectedCard.set({...value});
  }
}
