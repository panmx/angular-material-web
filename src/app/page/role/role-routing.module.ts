import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {routingPathConfig} from '@config/routing-path.config';
import {AuthService} from '../../auth.service';
import {RoleListComponent} from './role-list/roleList.component';
import {RoleAddComponent} from './role-form/roleAdd.component';
import {RoleEditComponent} from './role-form/roleEdit.component';
/**
 *  1.路由配置项里如果设置了keepAlive: true, 缓存该页面
 *  2.路由配置项里如果设置了permission: true, 说明该页面需要权限方可进入
 *  3.路由配置项里如果设置了listPage: {permission: '', url: ''}, 说明该详情/新增/编等辑页面会根据listPage所对应的列表页面判断其有无相应权限
 *   （其中，permission为权限类型《'search': 查询权限, 'add': 新增权限,'update': 修改权限 》，url为对应列表页的路径）
 *  4.路由配置项里如果设置了show: true: '', 说明在标签列表里显示该标签
 *  5.componentName路由复用时用到
 * */
let roleListUrl = '/' + routingPathConfig.app.role + '/' + routingPathConfig.role.roleList;
const routes: Routes = [
    {
        path: routingPathConfig.role.default,
        redirectTo: routingPathConfig.role.roleList,
        pathMatch: 'full'
    },
    {
        path: routingPathConfig.role.roleList,
        component: RoleListComponent,
        data: {
            title: '角色列表',
            path: roleListUrl, // 假路径
            keepAlive: true,
            permission: true,
            show: true,
            componentName: 'RoleListComponent'
        },
        canActivate: [AuthService]
    },
    {
        path: routingPathConfig.role.roleAdd,
        component: RoleAddComponent,
        data: {
            title: '新增角色',
            path: '/' + routingPathConfig.app.role + '/' + routingPathConfig.role.roleAdd, // 假路径
            keepAlive: true,
            permission: true,
            show: true,
            componentName: 'RoleAddComponent',
            listPage: {permission: 'add', url: roleListUrl}
        },
        canActivate: [AuthService]
    },
    {
        path: routingPathConfig.role.roleEdit,
        component: RoleEditComponent,
        data: {
            title: '修改角色',
            path: '/' + routingPathConfig.app.role + '/' + routingPathConfig.role.roleEdit, // 假路径
            keepAlive: true,
            permission: true,
            show: true,
            componentName: 'RoleEditComponent',
            listPage: {permission: 'update', url: roleListUrl}
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
export class RoleRoutingModule {
}
