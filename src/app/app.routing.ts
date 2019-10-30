import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { ProductListComponent, ProductAddEditComponent } from './products';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'products',
        component: ProductListComponent,
        children: [
            { path: 'add', component: ProductAddEditComponent },
            { path: 'edit/:id', component: ProductAddEditComponent }
        ]
    },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);

// for easy import into app module
export const routedComponents = [
    HomeComponent, 
    ProductListComponent, 
    ProductAddEditComponent
];