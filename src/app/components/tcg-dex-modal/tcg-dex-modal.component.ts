import { Component, output, signal } from '@angular/core';
import { TCGDexService } from 'src/app/services/tcg-dex.service';

@Component({  
  standalone: false,
  selector: 'app-tcg-dex-modal',
  templateUrl: './tcg-dex-modal.component.html',
  styleUrls: ['./tcg-dex-modal.component.scss'],
})
export class TcgDexModalComponent { 
  apiID = output<string>();

  protected isLoading = signal<boolean>(false);
  protected cards = signal<any>(undefined);
  protected selectedCard = signal<any>(undefined);

  constructor(private TCGDexService: TCGDexService) {}
  
  onModalPresent(){
    this.setIsLoading(true);
    this.setSelectedCard(undefined); 
    this.setCards(undefined);

    this.TCGDexService.searchCard()
      .subscribe((result) => {
        this.setCards(result); 

        this.setIsLoading(false);
      });
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
