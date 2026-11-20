import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TCGDexCardLight } from 'src/app/models/TCGDexCard';
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
  protected cards = signal<TCGDexCardLight[]>([]);
  protected selectedCard = signal<TCGDexCardLight>(new TCGDexCardLight());

  constructor(private TCGDexService: TCGDexService) {}
  
  onModalPresent(){
    this.setIsLoading(true);

    this.TCGDexService.searchCard(this.cardName())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.setCards(Object.values(result.sort((a, b) => a.id.localeCompare(b.id))));

        this.setIsLoading(false);
      });
  }

  onModalDismiss(){
    this.setIsLoading(false);
    this.setSelectedCard(new TCGDexCardLight()); 
    this.setCards([]);
  }

  onClickCard(card: any){
    this.setSelectedCard(card);

    this.apiID.emit(card.id); 
  }

  setIsLoading(value: boolean){
    this.isLoading.set(value);
  }

  setCards(value: TCGDexCardLight[]){
    this.cards.set(value);
  }

  setSelectedCard(value: TCGDexCardLight){
    this.selectedCard.set({...value});
  }
}
