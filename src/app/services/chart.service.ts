import { Injectable } from '@angular/core';
import { DataLineChart } from '../models/DataLineChart';
import { DataChartLegend } from '../models/DataChartLegend';
import { DataChart } from '../models/DataChart';

@Injectable({
    providedIn: 'root',
})
export class ChartService {
    private colors = ['#231544', '#6B3FF7'];
    private variousColors = ['#9FE8D8', '#E4F5F1'];

    constructor() {}

    buildPie(dataLineChart: DataLineChart[], showVariousColor: boolean = false): DataChart {
        let dataChart = new DataChart();
        const colors =  showVariousColor ? this.variousColors : this.colors;

        dataChart.option = {  
            color: colors,    
            tooltip: {
                trigger: 'item',
                triggerOn: 'click',
                position: 'inside',
                confine: true, 
                textStyle:{                 
                    fontSize: 12
                },
                formatter: (params: any) => {

                return `${params.percent} %`;
            }
            },                
            textStyle:{                 
                fontSize: 10
            },
            series: [
                {  
                    label: {
                        show: false,
                        position: 'center'
                    },
                    center: ['50%', '50%'],
                    name: '',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    labelLine: {
                        show: false
                    },
                    data: dataLineChart
                }
            ]
        };

        dataChart.legends = this.getPieLegend(dataLineChart, colors);

        return dataChart;
    }

    buildLineArea(dataLineChart: DataLineChart[]): DataChart {
        // on regroupe sur les 6 derniers mois
        // sur un an  soit 12 mois avant
        // sur tout les années
        let dataChart = new DataChart();

       dataChart.option =  {
            color:  this.colors,
            // marges réduites, 'same' garde les libellés des axes à l'intérieur de la zone
            grid: {
                left: 0,
                right: 4,
                top: 4,
                bottom: 0,
                outerBoundsMode: 'same',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none',
                    label: {
                        backgroundColor: '#b9aee8'
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: dataLineChart.map((x) =>  x.libelle),
                    axisLabel: {
                        color: '#6B3FF7',
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#6B3FF7',
                        },
                    },
                    axisTick: {
                        show: false,
                        
                    },
                },          
            ],
            yAxis: [
                {   
                   
                    type: 'value', 
                    splitLine: {
                        show: false
                    },
                    interval: 3000,
                    axisLabel: {
                        color: '#231544',
                        fontSize: 10
                    },
                }
            ],
            series: [
                {
                    name: 'Valeur total',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        color: '#6B3FF7',
                        width: 2
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.6,
                        color:'#b9aee8'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: dataLineChart
                },
            ]
        }; 
        
        return dataChart;
    }

    private getColor(index: number, colors: string[]){
        return colors[index > colors.length - 1 ? (index - Math.trunc(index / 2) * colors.length) : index]
    }

    private getPieLegend(dataLineChart: DataLineChart[], colors: string[]): DataChartLegend[]{
        let legends: DataChartLegend[] = [];
        const total = this.getTotal(dataLineChart);
        let index = 0;

        for(let line of dataLineChart){
            let legend = new DataChartLegend();
            legend.color = this.getColor(index, colors);
            legend.libelle = line.libelle;
            legend.percentage = (line.value * 100) /total;
            legend.value = line.value;

            legends.push(legend)
            index++;
        }
        return legends; 
    }

    private getTotal(dataLineChart: DataLineChart[]){
        return dataLineChart.map(x => x.value).reduce((x, y) => x + y);
    }
}
