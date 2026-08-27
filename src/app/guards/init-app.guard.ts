import { inject } from "@angular/core";
import { AppInitService } from "../services/app-init.service";


export const InitAppGuard = () => {
    const appInitService = inject(AppInitService);

    return !appInitService.isAppInit();
}