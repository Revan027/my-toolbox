import { Component, computed, DestroyRef, inject, OnInit, Signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardService } from 'src/app/services/card.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
    standalone: false,
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  displayDashboard: boolean | undefined = true;
  totalValue: number = 0;
  totalCard: number = 0;
  totalMissingCard: number = 0;
  totalAcquiredCard: number = 0;
  percentageCompletion: number = 0;
  averagePrice: number = 0;

  constructor(private dashboardService: DashboardService, private cardService: CardService, ) { 
    this.cardService.cardsChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.initDashboard()
    });
  }
  
  ngOnInit() {
    this.initDashboard();
  }

  async initDashboard(){
    const [totalCard, totalValue, totalMissingCard, totalAcquiredCard] = await Promise.all([
      this.dashboardService.countTotalCard(),
      this.dashboardService.countTotalValue(),
      this.dashboardService.countTotalMissingCard(),
      this.dashboardService.countTotalAcquiredCard(),
    ]);

    this.totalCard = totalCard;
    this.totalValue = totalValue;
    this.totalMissingCard = totalMissingCard;
    this.totalAcquiredCard = totalAcquiredCard;
    this.averagePrice = this.dashboardService.getAveragePrice(this.totalValue,  this.totalCard);
    this.percentageCompletion = this.dashboardService.getPercentageCompletion(this.totalAcquiredCard,  this.totalCard);
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
