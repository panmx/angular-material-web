import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MatDialog } from '@angular/material';

import { Subject, from } from 'rxjs';
import { takeUntil, filter, map, mergeMap, pairwise } from 'rxjs/operators';
import { NgForage } from 'ngforage';

import { NotaddConfigService } from '@notadd/services/config.service';
import { NotaddLoadingService } from '@notadd/services/notadd-loading.service';
import { NotaddNavigationService } from '@notadd/components/navigation/navigation.service';
import { NotaddSidebarService } from '@notadd/components/sidebar/sidebar.service';

import {StorageUtil} from  './utils/storage.util'
import {SimpleReuseStrategy} from "./SimpleReuseStrategy";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'notadd-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    notaddConfig: any;
    navigation: any;

    /* 是否全屏页面 */
    isFullScreen: boolean;

    private ngUnsubscribe: Subject<any>;
    @ViewChild('updateConfirmDialog') updateConfirmDialog: TemplateRef<any>;
    // 路由列表
    tagsList: Array<{ title: string, path: string, permission: string, show: boolean, componentName: string, isSelect: boolean }> = [];
    @Output() tagsEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private swUpdate: SwUpdate,
        @Inject(DOCUMENT) private document: any,
        private loadingService: NotaddLoadingService,
        private configService: NotaddConfigService,
        private navigationService: NotaddNavigationService,
        private platform: Platform,
        private sidebarService: NotaddSidebarService,
        private ngForage: NgForage,
        private dialog: MatDialog,
        private titleService: Title
    ) {
        this.navigation = []; // 导航菜单

        this.isFullScreen = false;

        // 注册导航
        let menuArr = StorageUtil.getItem(StorageUtil.storageKey.user_menuList);
        if (menuArr) {
            this.navigationService.register('page', menuArr);
            //
            // 设置key为 `main` 的导航为当前导航
            this.navigationService.setCurrentNavigation('page');
        }

        // 在移动端平台上添加 `is-mobile` 类
        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        this.ngUnsubscribe = new Subject();
    }

    ngOnInit() {
        this.configService.config
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(config => {
                this.notaddConfig = config;

                this.notaddConfig.layout.width === 'boxed' ?
                this.document.body.classList.add('boxed') :
                this.document.body.classList.remove('boxed');
            });

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),  // 筛选原始的Observable：this.router.events
                map(() => this.activatedRoute),
                map(route => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                mergeMap(route => route.data)
            )
            .subscribe((data) => {
                this.isFullScreen = !data['isFullScreen'] === void (0) || data['isFullScreen'];

                const url = this.router.url;
                const isLogin = StorageUtil.getItem(StorageUtil.storageKey.isLogin);
                // 未登录/会话过期或者是404,403等错误页面，删除全部页面的路由缓存，并且清空标签列表
                if (!isLogin || isLogin === 'false' || url.indexOf('/common/errors') >=0) {
                    SimpleReuseStrategy.deleteAllRouteSnapshot();
                    this.tagsList = [];
                } else {
                    // 路由data的标题
                    let title = data['title'];
                    const path = data['path'];
                    // 路径参数
                    const param = this.router['browserUrlTree'] && this.router['browserUrlTree'].queryParams ? this.router['browserUrlTree'].queryParams : {};
                    // 设置tags标题
                    if(param && param['taskId']){
                        if(url.indexOf('/task/taskDetail') >= 0){
                            title = (param['clientName'] ? param['clientName'] : title) + '[' + param['taskId'] + ']'
                        } else if(param && param['isUpdateTime'] && url.indexOf('/task/analysisPerson') >= 0){
                            title = '耗时修改' + '[' + param['taskId'] + ']'
                        } else{
                            title = title + '[' + param['taskId'] + ']'
                        }
                    }

                    // 关闭指定页面
                    let colsePage = '';
                    if(window['colsePage']){
                        colsePage = window['colsePage']
                    }
                    this.tagsList = this.tagsList.filter(p => {
                        if (p.path && p.path === url) {
                            p.isSelect = true;
                        }else{
                            p.isSelect = false;
                        }
                        if(colsePage == p.path){
                            // 删除指定关闭页面的路由缓存
                            let colsePath = colsePage.replace(/\//g, '_') + '_' + p.componentName;
                            SimpleReuseStrategy.deleteRouteSnapshot(colsePath);
                            return false;
                        }else {
                            return true;
                        }
                    });
                    window['colsePage'] = '';

                    const menu = {
                        title: title,
                        path: url,
                        permission: data['permission'],
                        show: data['show'],
                        componentName: data['componentName'] ? data['componentName'] : '',
                        isSelect: true
                    };
                    this.titleService.setTitle(title);
                    const exitMenu = this.tagsList.find(info => info.path === url);
                    if (exitMenu) { // 如果存在不添加，当前表示选中
                        this.tagsList.forEach(p => p.isSelect = p.path === url);
                        return;
                    }
                    if (exitMenu) { // 如果存在不添加，当前表示选中
                        return;
                    }
                    if (menu.show) {
                        this.tagsList.push(menu);
                    }
                }
            });

        from(this.ngForage.getItem('NOTADD_CONFIG'))
            .subscribe(localConfig => {
                this.configService.config = localConfig;
            });

        this.swUpdate.isEnabled && this.swUpdate.available.subscribe(_ => {
            const dialogRef = this.dialog.open(this.updateConfirmDialog, {
                hasBackdrop: true,
                disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
                result && window.location.reload();
            });
        });
    }

    // 获取子组件传给父组件的数据
    getTagsList(e){
        this.tagsList = e;
    }

    /**
     * 切换侧边栏打开
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this.sidebarService.getSidebar(key).toggleOpen();
    }

    ngOnDestroy() {
        /* 取消订阅 */
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
