import { Injectable } from '@angular/core';
import { tableName } from 'src/app/constants/table-names';
import { StorageService } from './storage.services.common/storage-service';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {   
    constructor(private storageService: StorageService) {}

}
