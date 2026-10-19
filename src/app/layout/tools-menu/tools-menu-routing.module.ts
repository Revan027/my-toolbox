import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolsMenuComponent } from './tools-menu.component';

const routes: Routes = [
    {
        path: '',
        component: ToolsMenuComponent,
        children: [
            {
                path: 'convertisseur',
                loadChildren: () =>
                    import('../../pages/various/convert/convert.module').then(
                        (m) => m.ConvertPageModule,
                    ),
            },
            {
                path: '',
                redirectTo: 'convertisseur',
                pathMatch: 'full',
            },
            {
                path: 'tcg',
                redirectTo: '/tcg',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class ToolsMenuRoutingModule {}
