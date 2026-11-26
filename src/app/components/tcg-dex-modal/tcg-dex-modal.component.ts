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
  protected cards = signal<TCGDexCardLight[] | undefined>(undefined);
  protected selectedCard = signal<TCGDexCardLight>(new TCGDexCardLight());

  constructor(private TCGDexService: TCGDexService) {}
  
  onModalPresent(){
    this.setIsLoading(true);

    this.onSearchCard();
  }

  onModalDismiss(){
    this.setIsLoading(false);
    this.setSelectedCard(new TCGDexCardLight()); 
    this.setCards(undefined);
  }

  onClickCard(card: any){
    this.setSelectedCard(card);

    this.apiID.emit(card.id); 
  }

  onSearchCard(language: string = "fr", reload: boolean = false){
    this.TCGDexService.searchCard(this.cardName(), language)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {

        // nouvelle essai en anglais
        if(result.length == 0 && !reload){
          this.onSearchCard("en", true);
        }
        else{
          this.setCards(Object.values(result.sort((a, b) => a.id.localeCompare(b.id)))); // trie par id tcgdex
          this.setIsLoading(false);
        }
    });
  }

  setIsLoading(value: boolean){
    this.isLoading.set(value);
  }

  setCards(value: TCGDexCardLight[] | undefined){
    this.cards.set(value);
  }

  setSelectedCard(value: TCGDexCardLight){
    this.selectedCard.set({...value});
  }
}
