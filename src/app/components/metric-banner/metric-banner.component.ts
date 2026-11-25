import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardPricingService } from 'src/app/services/card-pricing.service';
import { CardService } from 'src/app/services/card.service';
import { StatistiqueService } from 'src/app/services/statistique.service';

@Component({
  standalone: false,
  selector: 'app-metric-banner',
  templateUrl: './metric-banner.component.html',
  styleUrls: ['./metric-banner.component.scss'],
})
export class MetricBannerComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  protected totalPurchaseValue: Signal<number>;
  protected progressPurchasePercentage: Signal<number>;
  protected totalMarketValue: Signal<number>;
  protected progressMarketPercentage: Signal<number>;

  constructor(
    private statistiqueService: StatistiqueService, 
    private cardService: CardService,
    private cardPricingService: CardPricingService
  ) 
  {
    this.totalPurchaseValue = this.statistiqueService.totalPurchaseValue;
    this.progressPurchasePercentage = this.statistiqueService.progressionPurchasePercentage;
    this.totalMarketValue = this.statistiqueService.totalMarketValue;
    this.progressMarketPercentage = this.statistiqueService.progressionMarketPercentage;

    this.cardService.cardsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.statistiqueService.resfreshMetricBanner();
      }); 

    this.cardPricingService.pricingChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
          this.statistiqueService.resfreshMetricBanner();
      });
  }

  ngOnInit() {}
}
