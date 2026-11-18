import { Generation } from "./Generation";
import { Serie } from "./Serie";
import { CardCondition } from "./CardCondition";

export class Card {
    constructor() {}

    id: number = 0;
    name!: string;
    srcPicture!: string;
    averagePrice!: number;
    isAcquired: boolean = false;
    serieID!: number;
    serie: Serie = new Serie();
    generationID!: number;
    generation: Generation = new Generation();
    isLegendary: boolean= false;
    condition?: CardCondition;
    conditionID?: number;
    dateAcquired?: string;
    apiID?: string;
    cardmarketID?: number;

    static fromSQL(data: any): Card {
        const card = new Card();
        card.id = data.id;
        card.name = data.name;
        card.srcPicture = data.srcPicture;
        card.isAcquired = data.isAcquired;
        card.averagePrice = data.averagePrice;
        card.conditionID = data.conditionID;
        card.isLegendary = data.isLegendary;
        card.dateAcquired = data.dateAcquired;
        card.serieID = data.serieID;
        card.serie = new Serie();
        card.serie.name = data.serie_name;
        card.serie.srcLogo = data.serie_src_logo;
        card.generationID = data.generationID;
        card.generation = new Generation();
        card.generation.libelle = data.generation_libelle;
        card.apiID = data.apiID;
        card.cardmarketID = data.cardmarketID;

        return card;
    }

    static getPeriod(date: Date){
        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}`
    }
}
