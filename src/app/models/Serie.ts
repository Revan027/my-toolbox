export class Serie {
    constructor() {}

    id: number = 0;
    name!: string;
    srcLogo!: string;

    static fromSQL(data: any): Serie {
        const serie = new Serie();
        serie.id = data.id;
        serie.name = data.name;
        serie.srcLogo = data.srcLogo;

        return serie;
    }
}
