import {Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil, filter, map, mergeMap } from 'rxjs/operators';

import { NotaddConfigService } from '@notadd/services/config.service';
import {StorageUtil} from "../utils/storage.util";
import {UserService} from "../service/user/user.service";
import {MessageService} from "../message.service";
import {NotaddNavigationService} from "../../@notadd/components/navigation/navigation.service";
import {User} from "../entity/user/user.entity";

@Component({
    selector: 'layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [UserService]
})
export class LayoutComponent implements OnInit, OnDestroy {
    @Input() public tagsList: any;
    @Output() tagsEvent: EventEmitter<any> = new EventEmitter();

    /* 取消订阅主题 */
    private ngUnsubscribe: Subject<any>;

    notaddConfig: any;
    hasContentHeader: boolean;
    isMobile: boolean;
    user = new User();

    constructor(
        private configService: NotaddConfigService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private breakpointObserver: BreakpointObserver,
        private userService: UserService,
        private navigationService: NotaddNavigationService,
        private messageService: MessageService
    ) {
        this.ngUnsubscribe = new Subject<any>();
        this.hasContentHeader = true;
    }

    ngOnInit() {
        this.configService.config
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(config => {
                this.notaddConfig = config;
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
                this.hasContentHeader = data['hasContentHeader'] === void (0) || data['hasContentHeader'];
            });

        this.breakpointObserver.observe([ Breakpoints.Handset ])
            .pipe(
                takeUntil(this.ngUnsubscribe),
                map(match => match.matches)
            )
            .subscribe(matches => {
                this.isMobile = matches;

                this.configService.config = {
                    layout: {
                        navbar: {
                            hidden: this.isMobile
                        },
                        toolbar: {
                            position: this.isMobile ? 'below-static' : this.notaddConfig.layout.toolbar.position
                        }
                    }
                };
            });

        let user = StorageUtil.getItem(StorageUtil.storageKey.user_encodeUser);
        let isLogin = StorageUtil.getItem(StorageUtil.storageKey.user_encodeUser);
        if(isLogin && user && user['userCode']){
            this.findUser()
        }
        this.findMenu()
    }

    /*查询用户信息*/
    findUser() {
        this.userService.findUser('')
            .subscribe(res => {
                if (res && res.success && res.data) {
                    this.user = res.data;
                    if(this.user.roleList){
                        let roleName = '';
                        this.user.roleList.filter(row=>{
                            if(row.roleType && row.roleType == 1){
                                res.data.adminState = row.roleType
                            }
                            roleName += roleName ? ('、' + row.roleName) : row.roleName
                        });
                        this.user.roleName = roleName;
                    }
                    this.messageService.sendMessage({key: 'userInfo', value: this.user});
                    StorageUtil.setItem(StorageUtil.storageKey.user_loginInfo, this.user);
                    this.findMenu()
                } else {

                }
            });
    }

    /*根据用户id查询菜单*/
    findMenu() {
        this.userService.findMenu('')
            .subscribe(res => {
                let a = {"success":true,"code":0,"errMessage":null,"errDate":null,"data":[{"id":"T001","menuName":"用户&权限","type":1,"parentId":null,"menuCode":null,"menuIcon":"pages","menuUrl":"","sort":10,"state":1,"addAuthority":0,"updateAuthority":0,"deleteAuthority":0,"createUser":null,"createUserName":null,"createDate":null,"updateUser":null,"updateUserName":null,"updateDate":null,"childMenus":[{"id":"T001001","menuName":"用户列表","type":2,"parentId":"T001","menuCode":null,"menuIcon":"grid_on","menuUrl":"/user/userList","sort":10,"state":1,"addAuthority":0,"updateAuthority":0,"deleteAuthority":0,"createUser":null,"createUserName":null,"createDate":null,"updateUser":null,"updateUserName":null,"updateDate":null,"childMenus":null},{"id":"T001002","menuName":"角色列表","type":2,"parentId":"T001","menuCode":null,"menuIcon":"lock","menuUrl":"/role/roleList","sort":20,"state":1,"addAuthority":0,"updateAuthority":0,"deleteAuthority":0,"createUser":null,"createUserName":null,"createDate":null,"updateUser":null,"updateUserName":null,"updateDate":null,"childMenus":null}]}],"count":0};
                // if (res && res["success"] && res["data"]) {
                    StorageUtil.setItem(StorageUtil.storageKey.user_menuList, a["data"]);
                    // 注册导航
                    this.navigationService.register('page',  a["data"]);
                    // 设置key为 `page` 的导航为当前导航
                    this.navigationService.setCurrentNavigation('page');
                // }
            });
    }

    // 获取子组件传给父组件的数据
    getTagsList(e){
        this.tagsList = e;
        // 通过emit将信息发射出去
        this.tagsEvent.emit(e);
    }

    /**
     * 单击 sidenav 背景事件
     */
    onBackdropClick(): void {
        this.configService.config = {
            layout: {
                navbar: {
                    hidden: true
                }
            }
        };
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}
