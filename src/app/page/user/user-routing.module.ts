import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {routingPathConfig} from '@config/routing-path.config';
import {AuthService} from '../../auth.service';
import {PersonComponent} from './person/person.component';
import {UserListComponent} from './user-list/userList.component';
import {UserEditComponent} from './user-form/userEdit.component';
import {UserAddComponent} from './user-form/userAdd.component';

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
        path: routingPathConfig.user.default,
        redirectTo: routingPathConfig.user.person,
        pathMatch: 'full'
    },
    {
        path: routingPathConfig.user.person,
        component: PersonComponent,
        data: {
            title: '个人信息',
            path: '/' + routingPathConfig.app.user + '/' + routingPathConfig.user.person, // 假路径
            keepAlive: true,
            permission: false,
            show: true,
            componentName: 'PersonComponent'
        },
        canActivate: [AuthService]
    },
    {
        path: routingPathConfig.user.userList,
        component: UserListComponent,
        data: {
            title: '用户列表',
            path: '/' + routingPathConfig.app.user + '/' + routingPathConfig.user.userList, // 假路径
            keepAlive: true,
            permission: true,
            show: true,
            componentName: 'UserListComponent'
        },
        canActivate: [AuthService]
    },
    {
        path: routingPathConfig.user.userAdd,
        component: UserAddComponent,
        data: {
            title: '新增用户',
            path: '/' + routingPathConfig.app.user + '/' + routingPathConfig.user.userAdd, // 假路径
            keepAlive: true,
            permission: true,
            show: true,
            componentName: 'UserAddComponent',
            listPage: {permission: 'add', url: ('/' + routingPathConfig.app.user + '/' + routingPathConfig.user.userList)}
        },
        canActivate: [AuthService]
    },
    {
        path: routingPathConfig.user.userEdit,
        component: UserEditComponent,
        data: {
            title: '用户修改',
            path: '/' + routingPathConfig.app.user + '/' + routingPathConfig.user.userEdit, // 假路径
            keepAlive: true,
            permission: true,
            show: true,
            componentName: 'UserEditComponent',
            listPage: {permission: 'update', url: ('/' + routingPathConfig.app.user + '/' + routingPathConfig.user.userList)}
        },
        canActivate: [AuthService]
    },
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
export class UserRoutingModule {
}
