import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';

const routes: Routes = [
    {
        path: '',
        component: MenuComponent,
        children: [
            {
                path: 'convertisseur',
                loadChildren: () =>
                    import('../pages/convert/convert.module').then(
                        (m) => m.ConvertPageModule,
                    ),
            },
            {
                path: 'tcg',
                loadChildren: () =>
                    import('../pages/tcg/suivi-tcg/suivi-tcg.module').then(
                        (m) => m.SuiviTCGPageModule,
                    ),
            },
            {
                path: 'backup',
                loadChildren: () =>
                    import('../pages/backup/backup.module').then(
                        (m) => m.BackupPageModule,
                    ),
            },
            {
                path: '',
                redirectTo: 'tcg',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class MenuRoutingModule {}
