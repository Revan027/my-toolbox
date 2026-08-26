import { Injectable } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { Generation } from 'src/app/models/Generation';
import { Capacitor } from '@capacitor/core';
import { MOCK_GENERATIONS } from 'src/app/constants/mock-data';
import { StorageService } from './storage.services.common/storage-service';

@Injectable({
    providedIn: 'root',
})
export class GenerationService {
    constructor(private storageService: StorageService) {}

    async getAll() {
        if (Capacitor.isNativePlatform()){
            let result = await this.storageService
                .getDb()
                .query(`SELECT * FROM ${tableName.generation}`);

            return result.values as Generation[];
        }
        
        return MOCK_GENERATIONS;
    }
}
