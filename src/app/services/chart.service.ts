import { Injectable } from '@angular/core';
import { StorageService } from './storage.services.common/storage-service';
import { EChartsOption } from 'echarts';
import { DataLineChart } from '../models/DataLineChart';
import { DataChartLegend } from '../models/DataChartLegend';
import { DataChart } from '../models/DataChart';

@Injectable({
    providedIn: 'root',
})
export class ChartService {
    private colors = ['#231544', '#6B3FF7'];

    constructor(private storageService: StorageService) {}

    buildPie(dataLineChart: DataLineChart[]): DataChart {
        let dataChart = new DataChart();

        dataChart.option = {  
            color: this.colors,    
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

        dataChart.legends = this.getPieLegend(dataLineChart);

        return dataChart;
    }

    buildLineArea(): EChartsOption {
       return  {         
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
                }
            },
            xAxis: [
                {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
            ],
            yAxis: [
                {
                type: 'value'
                }
            ],
            series: [
                {
                name: 'Line 1',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    color: '#5470C6',
                    width: 5
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color:'rgb(255, 191, 0)'
                },
                emphasis: {
                    focus: 'series'
                },
                data: [140, 232, 101, 264, 90, 340, 250]
                },
            ]
        };
    }

    getColor(index: number){
        return this.colors[index > this.colors.length - 1 ? (index - Math.trunc(index / 2) * this.colors.length) : index]
    }

    getPieLegend(dataLineChart: DataLineChart[]): DataChartLegend[]{
        let legends: DataChartLegend[] = [];
        const total = this.getTotal(dataLineChart);
        let index = 0;

        for(let line of dataLineChart){
            let legend = new DataChartLegend();
            legend.color = this.getColor(index);
            legend.name = line.name;
            legend.percentage = (line.value * 100) /total;
            legend.value = line.value;

            legends.push(legend)
            index++;
        }
        return legends; 
    }

    getTotal(dataLineChart: DataLineChart[]){
        return dataLineChart.map(x => x.value).reduce((x, y) => x + y);
    }
}
