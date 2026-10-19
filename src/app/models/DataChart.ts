import { EChartsOption } from "echarts";
import { DataChartLegend } from "./DataChartLegend";

export class DataChart {
    constructor() {}

    option!: EChartsOption;
    legends!: DataChartLegend[];
}
