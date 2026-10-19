import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TcgMenuComponent } from './tcg-menu.component';

const routes: Routes = [
    {
        path: '',
        component: TcgMenuComponent,
        children: [
            {
                path: '',
                redirectTo: 'suivi',
                pathMatch: 'full',
            },
            {
                path: 'suivi',
                loadChildren: () =>
                    import('../../pages/tcg/suivi-tcg/suivi-tcg.module').then(
                        (m) => m.SuiviTCGPageModule,
                    ),
            },
            {
                path: 'backup',
                loadChildren: () =>
                    import('../../pages/tcg/backup/backup.module').then(
                        (m) => m.BackupPageModule,
                    ),
            },
            {
                path: 'tools',
                redirectTo: '/tools',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class TcgMenuRoutingModule {}
