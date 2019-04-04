import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {routingPathConfig} from '@config/routing-path.config';
import {AuthService} from './auth.service'

const routes: Routes = [
    {
        path: routingPathConfig.app.default,
        redirectTo: 'user/person',
        pathMatch: 'full'
    },
    {
        path: routingPathConfig.app.common,
        loadChildren: './page/common/common.module#CommonModule',
        data: {title: '通用模块'}
    },
    {
        path: routingPathConfig.app.user,
        loadChildren: './page/user/user.module#UserModule',
        data: {title: ''}
    },
    {
        path: routingPathConfig.app.role,
        loadChildren: './page/role/role.module#RoleModule',
        data: {title: ''}
    },
    {
        path: routingPathConfig.app.wildcard,
        redirectTo: 'common/errors/404'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    declarations: [],
    exports: [
        RouterModule
    ],
    providers: [AuthService]
})
export class AppRoutingModule {
}
