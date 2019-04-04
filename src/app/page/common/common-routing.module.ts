import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { routingPathConfig } from '@config/routing-path.config';

import { ErrorsComponent } from './errors/errors.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import {AuthService} from '../../auth.service';

/**
 *  1.路由配置项里如果设置了keepAlive: true, 缓存该页面
 *  2.路由配置项里如果设置了permission: true, 说明该页面需要权限方可进入
 *  3.路由配置项里如果设置了listPage: {permission: '', url: ''}, 说明该详情/新增/编等辑页面会根据listPage所对应的列表页面判断其有无相应权限
 *   （其中，permission为权限类型《'search': 查询权限, 'add': 新增权限,'update': 修改权限 》，url为对应列表页的路径）
 *  4.路由配置项里如果设置了show: true: '', 说明在标签列表里显示该标签
 *  5.componentName路由复用时用到
 * */
const routes: Routes = [
    {
        path: routingPathConfig.common.default,
        redirectTo: routingPathConfig.common.login,
        pathMatch: 'full'
    },
    {
        path: routingPathConfig.common.errors,
        component: ErrorsComponent,
        data: {
            title: '错误页',
            isFullScreen: true,
            keepAlive: false,
            permission: false,
            show: false,
        },
        canActivate: [AuthService]
    },
    {
        path: routingPathConfig.common.login,
        component: LoginComponent,
        data: {
            title: '登录',
            isFullScreen: true,
            keepAlive: false,
            permission: false,
            show: false,
        }
    },
    {
        path: routingPathConfig.common.register,
        component: RegisterComponent,
        data: {
            title: '注册',
            isFullScreen: true,
            keepAlive: false,
            permission: false,
            show: false,
        }
    },
    {
        path: routingPathConfig.common.forgotPassword,
        component: ForgotPasswordComponent,
        data: {
            title: '忘记密码',
            isFullScreen: true,
            keepAlive: false,
            permission: false,
            show: false,
        }
    },
    {
        path: routingPathConfig.common.lockscreen,
        component: LockscreenComponent,
        data: {
            title: '锁定屏幕',
            isFullScreen: true,
            keepAlive: false,
            permission: false,
            show: false,
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [],
    exports: [
        RouterModule
    ]
})
export class CommonRoutingModule {
}
