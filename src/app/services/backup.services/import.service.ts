import { Injectable } from '@angular/core';
import { Rate } from 'src/app/models/Rate';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from '../storage.services.common/storage-service';

@Injectable({
    providedIn: 'root',
})
export class ImportService {
    constructor(private storageService: StorageService) {}

    launchImport(){
        
    }

    private importDatabase(){

    }

    private importImage(){
        
    }
}
