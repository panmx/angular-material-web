import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {User} from '../../../entity/user/user.entity';
import {Role} from '../../../entity/user/role.entity';
import {UserService} from '../../../service/user/user.service';
import {StorageUtil} from '../../../utils/storage.util';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {Enum} from '../../../utils/Enum';
import {SimpleReuseStrategy} from "../../../SimpleReuseStrategy";


@Component({
    selector: 'userList',
    templateUrl: './userList.component.html',
    styleUrls: ['./userList.component.scss'],
    providers: [UserService]
})
export class UserListComponent implements OnInit {
    isLoading: boolean;
    user = new User();
    pageIndex = 1;
    pageSize = 10;
    totalCount = 0; // 总数
    searchName = ''; // 关键词
    userArr: User[]; // 开发人员列表
    curCheckedUser = new User(); // 当前表格行选中任务对象
    displayedColumns = ['userCode', 'userName', 'userPhone', 'userEmail',
        'state', 'createDate', 'opr'];
    roleArr = [];
    userStateList = Enum.userStateList;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private userService: UserService,
                private router: Router) {
        this.isLoading = false;
    }

    ngOnInit() {
        this.findUserByPage();

        this.calcHeight();
        // 监听窗口大小
        let _this = this;
        window.onresize=function(){
            _this.calcHeight();
        };
    }

    // 计算高度
    calcHeight(){
        if (document.documentElement.clientHeight) {
            let clientHeight = document.documentElement.clientHeight;
            let a = document.getElementById('my-content');
            if(a && a.style){
                a.style.minHeight = (clientHeight - 125) + 'px';
            }
        }
    }

    // 选择行
    clickRow(row) {
        this.curCheckedUser = row;
    }

    // 刷新数据
    doSearch() {
        this.pageIndex = 1;
        this.totalCount = 0;
        this.findUserByPage();
    }

    /*查询用户列表*/
    findUserByPage() {
        this.userService.findUserByPage(this.pageIndex, this.pageSize, this.searchName)
            .subscribe(res => {
                if (res["success"] && res["data"]) {
                    this.userArr = res["data"];
                    this.userArr.filter(row => {
                        row.createDate = row.createDate ? moment(row.createDate).format('YYYY-MM-DD HH:mm') : ''
                    });
                    this.totalCount = res["count"];
                } else {
                    this.userArr = [];
                    this.totalCount = 0;
                }
            });
    }

    // 用户列表分页，改变页数
    changeTaskPage(e) {
        this.pageIndex = e.pageIndex + 1;
        this.pageSize = e.pageSize;
        this.findUserByPage()
    }

    getLabel(value, list) {
        let label = '';
        if (list) {
            list.filter(row => {
                if (value != undefined && row.value == value) {
                    label = row.label;
                }
            })
        }
        return label;
    }

    toPageDetail(item) {
        StorageUtil.setItem(StorageUtil.storageKey.user_detail, item);
        // 删除复用
        SimpleReuseStrategy.deleteRouteSnapshot('_user_userEdit_UserEditComponent');
        this.router.navigateByUrl('/user/userEdit');
    }

    addUser() {
        // 删除复用
        SimpleReuseStrategy.deleteRouteSnapshot('_user_userAdd_UserAddComponent');
        this.router.navigateByUrl('/user/userAdd');
    }


}
