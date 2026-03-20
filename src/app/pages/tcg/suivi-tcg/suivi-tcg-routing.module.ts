import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuiviTCGPage } from './suivi-tcg.page';

const routes: Routes = [
    {
        path: '',
        component: SuiviTCGPage,
    },
    {
        path: 'detail/:id',
        loadChildren: () =>
            import('../edit-tcg/edit-tcg.module').then(
                (m) => m.EditTCGPageModule,
            ),
    },
    {
        path: 'creation',
        loadChildren: () =>
            import('../edit-tcg/edit-tcg.module').then(
                (m) => m.EditTCGPageModule,
            ),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SuiviTCGPageRoutingModule {}
