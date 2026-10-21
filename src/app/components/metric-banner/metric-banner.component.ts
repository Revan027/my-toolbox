import { Component, input, OnInit, Signal, signal } from '@angular/core';
import { StatistiqueService } from 'src/app/services/statistique.service';

@Component({
  standalone: false,
  selector: 'app-metric-banner',
  templateUrl: './metric-banner.component.html',
  styleUrls: ['./metric-banner.component.scss'],
})
export class MetricBannerComponent implements OnInit {

  protected totalValue: Signal<number>;
  protected progressPercentage: Signal<number>;

  constructor(private statistiqueService: StatistiqueService) {
    this.totalValue = this.statistiqueService._totalValue;
    this.progressPercentage = this.statistiqueService._progressionPercentage;
  }

  ngOnInit() {}
}
