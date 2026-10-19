export class DataLineChart {
    constructor() {}

    value!: number;
    name!: string;
    
    static fromSQL(data: any): DataLineChart {
        const line = new DataLineChart();
        line.value = data.totalCount;
        line.name = data.name;

        return line;
    }
}
