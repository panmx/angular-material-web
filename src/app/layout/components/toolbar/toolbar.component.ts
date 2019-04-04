import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router} from '@angular/router';
import {Subject, Subscription} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as screenfull from 'screenfull';

import { RoutingPathPipe } from '@notadd/pipes/routing-path.pipe';
import { NotaddConfigService } from '@notadd/services/config.service';
import { NotaddSidebarService } from '@notadd/components/sidebar/sidebar.service';
import { routingPathConfig } from '@config/routing-path.config';
import {StorageUtil} from './../../../utils/storage.util';
import {User} from './../../../entity/user/user.entity';
import {NotaddBreadcrumb} from "../../../../@notadd/types/notadd-breadcrumb";
import {filter} from "rxjs/internal/operators";
import {MessageService} from "../../../message.service";

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    providers: [ RoutingPathPipe ]
})
export class ToolbarComponent implements OnInit, OnDestroy {
    user = new User();
    userName: string

    @Input()
    isMobile: boolean;

    rightNavbar: boolean;
    hiddenNavbar: boolean;
    collapseNavbar: boolean;
    notaddConfig: any;
    isFullscreen = false;
    isMoreToolbarVisible: boolean;
    breadcrumbs: Array<NotaddBreadcrumb>;
    breadcrumbData: string;

    /* 取消订阅主题 */
    private ngUnsubscribe: Subject<any>;
    subscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private configService: NotaddConfigService,
        private sidebarService: NotaddSidebarService,
        private router: Router,
        private path: RoutingPathPipe,
        private messageService: MessageService
    ) {
        this.ngUnsubscribe = new Subject<any>();
        this.isMoreToolbarVisible = false;
        this.breadcrumbs = [];
    }

    ngOnInit() {
        this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root);

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd)
            ).subscribe(event => {
            this.breadcrumbs = this.getBreadcrumbs(this.activatedRoute.root);
        });

        let curUser = StorageUtil.getItem(StorageUtil.storageKey.user_loginInfo);
        if(!curUser){
            curUser = StorageUtil.getItem(StorageUtil.storageKey.user_encodeUser);
        }
        if(curUser){
            this.user = curUser;
            this.userName = this.user.userName ? this.user.userName : this.user.userCode;
            // 从共享数据中获取用户信息
            this.subscription = this.messageService.getMessage()
                .subscribe(message => {
                    if(message['key'] && message['key'] === 'userInfo'){
                        this.user = message['value'];
                        this.userName = this.user.userName ? this.user.userName : this.user.userCode;
                    }
                });
        }
        this.configService.config
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((config) => {
                this.notaddConfig = config;
                this.rightNavbar = config.layout.navbar.position === 'end';
                this.hiddenNavbar = config.layout.navbar.hidden;
                this.collapseNavbar = config.layout.navbar.collapsed;
            });
    }

    private getBreadcrumbs(route: ActivatedRoute, url= '', breadcrumbs: Array<NotaddBreadcrumb>= []): Array<NotaddBreadcrumb> {
        const routeDataBreadcrumbs = 'title';
        // get the child routes
        const children: Array<ActivatedRoute> = route.children;

        // return if there are no more children
        if (children.length === 0) {
            return breadcrumbs;
        }

        // iterate over each children
        for (const child of children) {

            // verify primary route
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            // verify the custom data property "breadcrumb" is specified on the route
            // or route url not ""
            if (!child.snapshot.url.length || !child.snapshot.data.hasOwnProperty(routeDataBreadcrumbs)) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            }

            // get the route's URL segment
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

            // append route URL to URL
            url += `/${routeURL}`;

            // add breadcrumb
            const breadcrumb: NotaddBreadcrumb = {
                label: child.snapshot.data[routeDataBreadcrumbs] || this.breadcrumbData,
                params: child.snapshot.params,
                url
            };
            breadcrumbs.push(breadcrumb);

            // recursive
            return this.getBreadcrumbs(child, url, breadcrumbs);
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    /*退出*/
    loginOut(): void{
        StorageUtil.setItem(StorageUtil.storageKey.isLogin, false)
        this.router.navigateByUrl('/common/login');
    }

    /***
     * 切换全屏
     */
    toggleFullscreen() {
        if (screenfull.enabled) {
            screenfull.toggle();
            this.isFullscreen = !this.isFullscreen;
        }
    }

    /**
     * 切换侧边栏打开
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this.sidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * 切换侧边栏折叠
     */
    toggleSidenavCollapsed(): void {
        const config = {
            layout: {
                navbar: {
                    collapsed: !this.notaddConfig.layout.navbar.collapsed
                }
            }
        };

        if (this.notaddConfig.layout.navbar.hidden) {
            config.layout.navbar.collapsed = false;
        }

        this.configService.config = config;
    }

    /**
     * 切换侧边栏可见性
     */
    toggleSidenavVisibility(): void {
        this.configService.config = {
            layout: {
                navbar: {
                    hidden: !this.notaddConfig.layout.navbar.hidden
                }
            }
        };
    }

    /* 全局搜索 */
    search(event): void {
        console.log(event.value);
    }

    /**
     * 切换移动端更多工具栏可见
     */
    toggleMoreToolbarVisible(): void {
        this.isMoreToolbarVisible = !this.isMoreToolbarVisible;
    }

    /**
     * 菜单按钮点击
     */
    onMenuButtonClick(): void {
        this.isMobile ? this.toggleSidenavVisibility() : this.toggleSidenavCollapsed();
    }

    /**
     * 锁屏按钮点击
     */
    onLockButtonClick(): void {
        this.router.navigate([
            this.path.transform([
                routingPathConfig.app.common,
                routingPathConfig.common.lockscreen
            ])
        ]);
    }
}
