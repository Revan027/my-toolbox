import { Generation } from "./Generation";
import { Serie } from "./Serie";

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
    picture?: string;
    
    static fromSQL(data: any): Card {
        const card = new Card();
        card.id = data.id;
        card.name = data.name;
        card.srcPicture = data.srcPicture;
        card.picture = data.picture;
        card.isAcquired = data.isAcquired;
        card.averagePrice = data.averagePrice;
        card.serieID = data.serieID;
        card.serie = new Serie();
        card.serie.name = data.serie_name;
        card.serie.srcLogo = data.serie_src_logo;
        card.generationID = data.generationID;
        card.generation = new Generation();
        card.generation.libelle = data.generation_libelle;

        return card;
    }
}
