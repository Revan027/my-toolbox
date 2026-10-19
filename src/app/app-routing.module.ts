import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InitAppGuard } from './guards/init-app.guard';

const routes: Routes = [
    {
        path: 'loading',
        canActivate: [InitAppGuard],
        loadComponent: () =>
            import('./pages/loading/loading.page').then((m) => m.LoadingPage),
    },
    {
        path: 'tcg',
        loadChildren: () =>
            import('./layout/tcg-menu/tcg-menu.module').then((m) => m.TcgMenuModule),
        
    },
    {
        path: 'tools',
        loadChildren: () =>
            import('./layout/tools-menu/tools-menu.module').then((m) => m.ToolsMenuModule),
        
    },
    {
        path: '**',
        redirectTo: '',
    },
];
@NgModule({
    imports: [
        RouterModule.forRoot(
            routes, 
            {
                preloadingStrategy: PreloadAllModules , 
                scrollPositionRestoration: 'enabled',   // restaure sur retour arrière
                anchorScrolling: 'enabled',
            }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
