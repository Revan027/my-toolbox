export class DataLineChart {
    constructor() {}

    value!: number;
    libelle!: string;
    
    static fromSQL(data: any): DataLineChart {
        const line = new DataLineChart();
        line.value = data.totalCount;
        line.libelle = data.libelle;

        return line;
    }
}
