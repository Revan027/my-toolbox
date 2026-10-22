import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  protected totalValue: Signal<number>;
  protected progressPercentage: Signal<number>;

  constructor(private statistiqueService: StatistiqueService, private cardService: CardService) {
    this.totalValue = this.statistiqueService._totalValue;
    this.progressPercentage = this.statistiqueService._progressionPercentage;

    this.cardService.cardsChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
          this.statistiqueService.resfreshMetricBanner();
      }); 
  }

  ngOnInit() {}
}
