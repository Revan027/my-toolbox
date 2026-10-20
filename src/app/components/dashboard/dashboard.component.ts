import { Component, DestroyRef, inject, OnInit} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardService } from 'src/app/services/card.service';
import { StatistiqueService } from 'src/app/services/statistique.service';

@Component({
    standalone: false,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  // todo : avec l'arrivé d'une page dédie, des signaux seront nécéssaire pour recalculer le tout après une modif de liste
  displayDashboard: boolean | undefined = true;
  totalValue: number = 0;
  totalCard: number = 0;
  totalMissingCard: number = 0;
  totalAcquiredCard: number = 0;
  percentageCompletion: number = 0;
  averagePrice: number = 0;

  constructor(private statistiqueService: StatistiqueService, private cardService: CardService, ) { 
    this.cardService.cardsChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.initDashboard()
    });
  }
  
  ngOnInit() {
    this.initDashboard();
  }

  async initDashboard(){
    const [totalCard, totalValue, totalMissingCard, totalAcquiredCard] = await Promise.all([
      this.statistiqueService.countTotalCard(),
      this.statistiqueService.countTotalValue(),
      this.statistiqueService.countTotalMissingCard(),
      this.statistiqueService.countTotalAcquiredCard(),
    ]);

    this.totalCard = totalCard;
    this.totalValue = totalValue;
    this.totalMissingCard = totalMissingCard;
    this.totalAcquiredCard = totalAcquiredCard;
    this.averagePrice = this.statistiqueService.getAveragePrice(this.totalValue,  this.totalCard);
    this.percentageCompletion = this.statistiqueService.getPercentageCompletion(this.totalAcquiredCard,  this.totalCard);
  }

  onDisplayDashboard(){
    this.displayDashboard = !this.displayDashboard;
  }

  onAnimationDone(event: any){
    if (this.displayDashboard === false){
      this.displayDashboard = undefined;
    }
  }
}
