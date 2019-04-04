import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {StorageUtil} from './utils/storage.util';
import {ToolsUtils} from "./utils/tools.util";

/*路由拦截*/
@Injectable()
export class AuthService implements CanActivate {
    constructor(private router: Router) {
    }

    /** CanActivate路由进入拦截 **/
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let isNext: boolean;
        let userLogin = StorageUtil.getItem(StorageUtil.storageKey.isLogin);
        // 判断用户是否登入
        if (!userLogin || userLogin != "true") {
            isNext = false;
            // 未登入跳转到登入界面
            this.router.navigateByUrl('/common/login');
        } else { // 路由权限拦截
            isNext = true;

            // // 如果当前跳转的路由配置参数里含有listPage,且url不为空，则根据listPage的url来判断是否当前页面是否有权限进入；否则根据当前页面的url判断
            // let url = route.data['listPage'] &&  route.data['listPage'].url ? route.data['listPage'].url : route.data['path'];
            // let permission = route.data['listPage'] &&  route.data['listPage'].permission ? route.data['listPage'].permission : '';
            // url = permission === 'search' ? this.router.url: url;
            // if(url){
            //     if(!route.data['permission']){ // 特殊页面不需要权限验证
            //         isNext = true;
            //     } else {
            //         isNext = this.hasPermission(url, permission); // 判断是否有权限进入页面
            //         if(!isNext){ // 没有权限跳转到403页面
            //             this.router.navigateByUrl('/common/errors/403');
            //         }
            //     }
            // } else {
            //     isNext = true;
            // }
        }
        return isNext;
    }

    /** 判断是否有权限进入页面 **/
    hasPermission(url, permission): boolean{
        let permissionObj = ToolsUtils.checkPermission(url);
        if ((!permission  || permission === 'search') && permissionObj && permissionObj['isSearchPermission']) {
            return true
        } else if (permission && permission === 'add' && permissionObj && permissionObj['isAddPermission']) {
            return true
        } else if (permission && permission === 'update' && permissionObj && permissionObj['isEditPermission']) {
            return true
        }else {
            return false;
        }
    }
}
