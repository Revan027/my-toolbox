import { Component, computed, DestroyRef, inject, OnInit, Signal, signal} from '@angular/core';
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

  protected displayDashboard = signal<boolean | undefined>(true);
  protected totalCard = signal<number>(0);
  protected totalMissingCard = signal<number>(0);
  protected totalAcquiredCard = signal<number>(0);

  protected averagePrice: Signal<number>;
  protected percentageCompletion: Signal<number>;

  constructor(private statistiqueService: StatistiqueService, private cardService: CardService, ) {
    this.averagePrice = computed<number>(() =>
      this.statistiqueService.getAveragePrice(this.statistiqueService._totalValue(),  this.totalCard())
    );

    this.percentageCompletion = computed<number>(() =>
      this.statistiqueService.getCompletionPercentage(this.totalAcquiredCard(),  this.totalCard())
    );

    this.cardService.cardsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.initDashboard()
      });
  }
  
  ngOnInit() {
    this.initDashboard();
  }

  async initDashboard(){
    const [totalCard, totalMissingCard, totalAcquiredCard] = await Promise.all([
      this.statistiqueService.countTotalCard(),
      this.statistiqueService.countTotalMissingCard(),
      this.statistiqueService.countTotalAcquiredCard(),
    ]);

    this.setTotalCard(totalCard);
    this.setTotalMissingCard(totalMissingCard);
    this.setTotalAcquiredCard(totalAcquiredCard);
  }

  onDisplayDashboard(){
    this.setDisplayDashboard(!this.displayDashboard());
  }

  onAnimationDone(event: any){
    if (this.displayDashboard() === false){
      this.setDisplayDashboard(undefined);
    }
  }

  setDisplayDashboard(value: boolean | undefined){
    this.displayDashboard.set(value)
  } 

  setTotalCard(value: number){
    this.totalCard.set(value)
  } 

  setTotalMissingCard(value: number){
    this.totalMissingCard.set(value)
  } 

  setTotalAcquiredCard(value: number){
    this.totalAcquiredCard.set(value)
  }
}
