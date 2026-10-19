import { Component, signal } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Card } from 'src/app/models/Card';
import { DataChart } from 'src/app/models/DataChart';
import { ChartService } from 'src/app/services/chart.service';
import { FileService } from 'src/app/services/file.services.common/file.service';
import { StatistiqueService } from 'src/app/services/statistique.service';

@Component({
    standalone: false,
    selector: 'app-stats',
    templateUrl: './stats.page.html',
    styleUrls: ['./stats.page.scss'],
})
export class StatsPage {
    protected options = signal<EChartsOption>({});
    protected options2 = signal<EChartsOption>({});
    protected categoryChart = signal<DataChart>(new DataChart());
    protected acquisitionChart = signal<DataChart>(new DataChart());
    protected expensiveCards = signal<Card[]>([]);

    constructor(private chartService: ChartService, private statistiqueService: StatistiqueService, private fileService: FileService){}

    async ngOnInit(){
        const p1 = this.statistiqueService.getMostExpensiveCard();
        const p2 = this.statistiqueService.getCategoryChart();
        const p3 = this.statistiqueService.getAcquisitionChart();

        await Promise.all([p1, p2, p3])
            .then(async (results) => {
                this.setExpensiveCards(results[0]);
                this.setCategoryChartOption(this.chartService.buildPie(results[1]));
                this.setAcquisitionChartOption(this.chartService.buildPie(results[2]));
            })
        // il fadura un observalbe popur écocuter un crud surl es cartes
       
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
}
