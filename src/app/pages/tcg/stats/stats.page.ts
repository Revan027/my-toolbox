import { Component, DestroyRef, inject, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { PeriodEnum } from 'src/app/constants/PeriodEnum';
import { Card } from 'src/app/models/Card';
import { DataChart } from 'src/app/models/DataChart';
import { CardService } from 'src/app/services/card.service';
import { ChartService } from 'src/app/services/chart.service';
import { FileService } from 'src/app/services/capacitor.services.common/file.service';
import { StatistiqueService } from 'src/app/services/statistique.service';
import { TCGDexCard } from 'src/app/models/TCGDexCardPrice';
import { CardPricingService } from 'src/app/services/card-pricing.service';

@Component({
    standalone: false,
    selector: 'app-stats',
    templateUrl: './stats.page.html',
    styleUrls: ['./stats.page.scss'],
})
export class StatsPage { 
    private destroyRef = inject(DestroyRef);
    protected test = signal<TCGDexCard[]>([]);
    protected totalValueChart = signal<DataChart>(new DataChart());
    protected categoryChart = signal<DataChart>(new DataChart());
    protected acquisitionChart = signal<DataChart>(new DataChart());
    protected expensiveCards = signal<Card[]>([]);
    protected percentageCompletionLegendary = signal<number>(0);
    protected percentageCompletionGeneration1 = signal<number>(0);
    protected percentageCompletionGeneration2 = signal<number>(0);
    protected percentageCompletionGlobal = signal<number>(0);
    protected activeCurrentPeriod = signal<PeriodEnum>(PeriodEnum.TWELVE_MONTH);
    protected disableUpdatePricings = signal<boolean>(false);

    protected daysPastUpdated: Signal<number>;

    protected periodEnum = PeriodEnum;
    
    constructor(
        private cardService: CardService,
        private chartService: ChartService, 
        private statistiqueService: StatistiqueService, 
        private cardPricingService: CardPricingService,
        private fileService: FileService)
    {
        moment.locale('fr');

        this.cardService.cardsChanged
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.onUpdatePricings();
            });


        this.cardPricingService.pricingChanged
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.ngOnInit();
            });

        this.daysPastUpdated = this.cardPricingService._daysPastUpdated;
    }

    async ngOnInit(){
        const periods = this.statistiqueService.getPeriods(this.activeCurrentPeriod());

        const p1 = this.statistiqueService.getMostExpensiveCard();
        const p2 = this.statistiqueService.getCategoryChart();
        const p3 = this.statistiqueService.getAcquisitionChart();
        const p4 = this.statistiqueService.getCompletionGeneration(1);
        const p5 = this.statistiqueService.getCompletionGeneration(2);
        const p6 = this.statistiqueService.getCompletionLegendary();
        const p7 = this.statistiqueService.getCompletionGlobal();
        const p8 = this.statistiqueService.getTotalPurchaseChart(periods[0], periods[1]);  
        const p9 = this.cardPricingService.getDaysPastUpdated();
        const p10 = this.statistiqueService.getTotalMarketValueChart(periods[0], periods[1]);  
  
        await Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10])
            .then(async (results) => {
                this.setExpensiveCards(results[0]);
                this.setCategoryChartOption(this.chartService.buildPie(results[1]));
                this.setAcquisitionChartOption(this.chartService.buildPie(results[2], true));
                this.setPercentageCompletionGeneration1(results[3]);
                this.setPercentageCompletionGeneration2(results[4]);
                this.setPercentageCompletionLegendary(results[5]);
                this.setPercentageCompletionGlobal(results[6]);           
                this.setTotalValueChart(this.chartService.buildLineArea(results[7], results[9])); 
                this.cardPricingService.setDaysPastUpdated(results[8]);
            })
    }

    async onUpdatePricings(){
        this.setDisableUpdatePricings(true);

        await this.cardPricingService.updatePricings();

        this.cardPricingService.notifyPricingChanged();
        this.cardPricingService.setDaysPastUpdated(await this.cardPricingService.getDaysPastUpdated());

        this.setDisableUpdatePricings(false);  
        
        this.ngOnInit();
    }
    
    async onPeriodChanged(periodEnum: PeriodEnum){
        const periods = this.statistiqueService.getPeriods(periodEnum);

        this.updateActiveCurrentPeriod(periodEnum);

        // reconstruction du graphique
        this.setTotalValueChart(this.chartService.buildLineArea(
            await this.statistiqueService.getTotalPurchaseChart(periods[0], periods[1]), 
            await this.statistiqueService.getTotalMarketValueChart(periods[0], periods[1])
        ));
    }

    getSrc(path: string){
        return this.fileService.getUrlWeb(this.fileService.getPathUri(this.fileService.documentsUri(), path));
    }

    setExpensiveCards(value: Card[]){
        this.expensiveCards.set([...value]);
    }

    setCategoryChartOption(value: DataChart){
        this.categoryChart.set({...value});
    }

    setAcquisitionChartOption(value: DataChart){
        this.acquisitionChart.set({...value});
    }

    setPercentageCompletionLegendary(value: number){
        this.percentageCompletionLegendary.set(value);
    }

    setPercentageCompletionGeneration1(value: number){
        this.percentageCompletionGeneration1.set(value);
    }

    setPercentageCompletionGeneration2(value: number){
        this.percentageCompletionGeneration2.set(value);
    }

    setPercentageCompletionGlobal(value: number){
        this.percentageCompletionGlobal.set(value);
    }

    setDisableUpdatePricings(value: boolean){
        this.disableUpdatePricings.set(value);
    } 
    
    setTotalValueChart(value: DataChart){
        this.totalValueChart.set({...value});
    }

    updateActiveCurrentPeriod(value: PeriodEnum){
        this.activeCurrentPeriod.update((currentPeriod) => value);
    }
}
