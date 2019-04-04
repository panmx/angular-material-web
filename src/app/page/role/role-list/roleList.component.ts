import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatTableDataSource} from '@angular/material';
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
    selector: 'roleList',
    templateUrl: './roleList.component.html',
    styleUrls: ['./roleList.component.scss'],
    providers: [UserService]
})
export class RoleListComponent implements OnInit {
    isLoading: boolean;
    user = new User();
    pageIndex = 1;
    pageSize = 10;
    totalCount = 0; // 总数
    searchName = ''; // 关键词
    curCheckedUser = new Role(); // 当前表格行选中任务对象
    displayedColumns = ['roleName', 'description', 'roleType',
        'state', 'updateDate', 'opr'];
    roleArr = [];
    roleTypeList = Enum.roleTypeList;
    userStateList = Enum.userStateList;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private userService: UserService,
                public dialog: MatDialog,
                private router: Router) {
        this.isLoading = false;
    }

    ngOnInit() {
        this.findRole();

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
        this.findRole();
    }

    // 列表分页，改变页数
    changeTaskPage(e) {
        this.pageIndex = e.pageIndex + 1;
        this.pageSize = e.pageSize;
        this.findRole()
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

    findRole(){
        this.userService.findRole(this.pageIndex, this.pageSize)
            .subscribe(res => {
                if (res["success"] && res["data"]) {
                    this.roleArr = res["data"];
                    this.totalCount = res['count'];
                } else {
                    this.roleArr =[];
                    this.totalCount = 0;
                }
            });
    }

    toUpdateRole(){

    }

    toPageDetail(item) {
        StorageUtil.setItem(StorageUtil.storageKey.role_detail, item);
        // 删除复用
        SimpleReuseStrategy.deleteRouteSnapshot('_role_roleEdit_RoleEditComponent');
        this.router.navigateByUrl('/role/roleEdit');
    }

    add() {
        // 删除复用
        SimpleReuseStrategy.deleteRouteSnapshot('_role_roleAdd_RoleAddComponent');
        this.router.navigateByUrl('/role/roleAdd');
    }
}
