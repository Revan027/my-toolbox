import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { MOCK_SERIES } from 'src/app/constants/mock-data';
import { tableName } from 'src/app/constants/table-names';
import { Serie } from 'src/app/models/Serie';
import { StorageService } from './storage.services.common/storage-service';

@Injectable({
    providedIn: 'root',
})
export class SerieService {
    private _series = signal<Serie[]>([]);
    readonly series = this._series.asReadonly();

    constructor(private storageService: StorageService) {}

    async getAll() {
        if (Capacitor.isNativePlatform()){
            let result = await this.storageService
                .getDb()
                .query(`SELECT serie.id, serie.name, serie.srcLogo FROM ${tableName.serie} AS serie`);

            const series: Serie[] = result.values?.map((data: any)=>{
                return Serie.fromSQL(data);
            })|| [];

            return series;
        }
        
        return MOCK_SERIES;
    }

    load(series: Serie[]){
        this._series.set(series);
    }
}
