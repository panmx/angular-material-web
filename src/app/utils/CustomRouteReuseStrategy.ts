import {ActivatedRouteSnapshot, DetachedRouteHandle, PRIMARY_OUTLET, Route, RouteReuseStrategy} from "@angular/router";

/**
 * 重写angular路由重用策略，路由重用（多标签页实现）和路由懒加载最终解决方案(此类暂时不用，放这仅供参考)
 */
export class CustomRouteReuseStrategy extends RouteReuseStrategy {
    handlers: {[path:string]:DetachedRouteHandle} = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        //Avoid second call to getter(避免第二次调用getter)
        let config: Route = route.routeConfig;
        //Don't store lazy loaded routes(不存储延迟加载的路由)
        return config && !config.loadChildren;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        let path: string = this.getRoutePath(route);
        this.handlers[path] = handle;
        /*
          This is where we circumvent the error.
          Detached route includes nested routes, which causes error when parent route does not include the same nested routes
          To prevent this, whenever a parent route is stored, we change/add a redirect route to the current child route
          (这是我们规避错误的地方。
          分离的路由包括嵌套路由，当父路由不包含相同的嵌套路由时会导致错误
          为了防止这种情况，无论何时存储父路由，我们都会将重定向路由更改/添加到当前子路由)
        */
        let config: Route = route.routeConfig;
        if(config) {
            let childRoute: ActivatedRouteSnapshot = route.firstChild;
            let futureRedirectTo = childRoute ? childRoute.url.map(function(urlSegment) {
                return urlSegment.path;
            }).join('/') : '';
            let childRouteConfigs: Route[] = config.children;
            if(childRouteConfigs) {
                let redirectConfigIndex: number;
                let redirectConfig: Route = childRouteConfigs.find(function(childRouteConfig, index) {
                    if(childRouteConfig.path === '' && !!childRouteConfig.redirectTo) {
                        redirectConfigIndex = index;
                        return true;
                    }
                    return false;
                });
                //Redirect route exists(重定向路由存在)
                if(redirectConfig) {
                    if(futureRedirectTo !== '') {
                        //Current activated route has child routes, update redirectTo(当前激活的路由有子路由，更新redirectTo )
                        redirectConfig.redirectTo = futureRedirectTo;
                    } else {
                        //Current activated route has no child routes, remove the redirect (otherwise retrieval will always fail for this route)（当前激活的路由没有子路由，删除重定向（否则此路由的检索将始终失败））
                        childRouteConfigs.splice(redirectConfigIndex, 1);
                    }
                } else if(futureRedirectTo !== '') {
                    childRouteConfigs.push({
                        path: '',
                        redirectTo: futureRedirectTo,
                        pathMatch: 'full'
                    });
                }
            }
        }
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.handlers[this.getRoutePath(route)];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        let config: Route = route.routeConfig;
        //We don't store lazy loaded routes, so don't even bother trying to retrieve them（我们不会存储懒加载路线，所以甚至不试图检索他们）
        if(!config || config.loadChildren) {
            return false;
        }
        return this.handlers[this.getRoutePath(route)];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    getRoutePath(route: ActivatedRouteSnapshot): string {
        let namedOutletCount: number = 0;
        return route.pathFromRoot.reduce((path, route) => {
            let config: Route = route.routeConfig;
            if(config) {
                if(config.outlet && config.outlet !== PRIMARY_OUTLET) {
                    path += `(${config.outlet}:`;
                    namedOutletCount++;
                } else {
                    path += '/';
                }
                return path += config.path
            }
            return path;
        }, '') + (namedOutletCount ? new Array(namedOutletCount + 1).join(')') : '');
    }
}
