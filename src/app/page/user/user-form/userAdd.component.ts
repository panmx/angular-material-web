import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../entity/user/user.entity';
import {Role} from '../../../entity/user/role.entity';
import {UserService} from '../../../service/user/user.service';
import {StorageUtil} from '../../../utils/storage.util';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {Enum} from '../../../utils/Enum';
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material";
import {SimpleReuseStrategy} from "../../../SimpleReuseStrategy";


@Component({
    selector: 'userAdd',
    templateUrl: './userEdit.component.html',
    styleUrls: ['./userEdit.component.scss'],
    providers: [UserService]
})
export class UserAddComponent implements OnInit {
    isLoading: boolean;
    saveUser = new User();
    stateList = Enum.userStateList;
    roleArr = new MatTableDataSource<Role>([]);
    displayedColumns = ['select', 'roleName', 'description', 'roleType',
        'state'];
    userStateList = Enum.userStateList;
    roleTypeList = Enum.roleTypeList;
    selection = new SelectionModel<Role>(true, []);
    regMobile = /^1[3|4|5|8][0-9]\d{4,8}$/;
    regPhone = /0\d{2,3}-\d{7,8}/;
    regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    regIDCard15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
    regIDCard18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;


    constructor(private userService: UserService,
                private router: Router) {
        this.isLoading = false;
    }

    ngOnInit() {
        this.saveUser.state = 1;
        this.calcHeight();
        // 监听窗口大小
        let _this = this;
        window.onresize=function(){
            _this.calcHeight();
        };
        this.findRole();
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

    dealRoleCheck(){
        if (this.roleArr.data && this.roleArr.data.length && this.saveUser.roleList && this.saveUser.roleList.length) {
            this.roleArr.data.filter(row=>{
                this.saveUser.roleList.filter(item=>{
                    if(row.id && row.id == item.id){
                        row.checked = true;
                        this.selection.select(row); // 选中角色
                    }
                })
            })
        }
    }

    clickTab(e){

    }

    getStateLabel(value) {
        let label = '';
        let stateList = [{label: '启用', value: 1}, {label: '禁用', value: 0}];
        stateList.filter(row => {
            if (value != undefined && row.value == value) {
                label = row.label
            }
        });
        return label;
    }

    doCheck(){
        let strErr = '';
        if (!this.saveUser.userCode || !this.saveUser.userCode.trim()) {
            strErr += '、账号'
        }
        if (!this.saveUser.userName || !this.saveUser.userName.trim()) {
            strErr += '、姓名'
        }
        if (!this.saveUser.userPhone || !this.saveUser.userPhone.trim()) {
            strErr += '、手机号'
        }
        if (strErr) {
            strErr = strErr.substr(1, strErr.length);
            strErr += '不能为空！';
            alert(strErr);
            return false
        } else {
            if (strErr) {
                alert(strErr);
                return false
            } else {
                if (this.saveUser.password  && this.saveUser.password != this.saveUser.rePassword) {
                    alert('密码和确认密码不一致！');
                    return false;
                }
                let strError = '';
                if(this.saveUser.userPhone && !this.regMobile.test(this.saveUser.userPhone)){
                     strError += '、手机'
                }
                if(this.saveUser.userEmail && !this.regEmail.test(this.saveUser.userEmail)){
                    strError += '、邮箱'
                }
                if(strError){
                    strError = strError.substr(1, strError.length);
                    strError += '格式不正确！';
                    alert(strError);
                    return false
                }
                return true
            }
        }
    }

    saveUserClick(){
        if(!this.doCheck()){
            return;
        }
        this.isLoading = true;
        this.saveUser.roleList = this.selection.selected;
        this.userService.saveUser(this.saveUser)
            .subscribe(res => {
                this.isLoading = false;
                if (res["success"]) {
                   this.closeCurPage();
                   this.router.navigateByUrl('/user/userList');
                } else {
                    alert('保存失败！' + (res['errMessage'] ? res['errMessage'] : ''))
                }
            });
    }

    // 关闭当前页
    closeCurPage(){
        window['colsePage'] = this.router.url;
        // 删除复用
        // SimpleReuseStrategy.deleteRouteSnapshot('_user_userList_UserListComponent');
    }

    findRole(){
        this.userService.findRole(1, 1000)
            .subscribe(res => {
                if (res["success"] && res["data"]) {
                    this.roleArr = new MatTableDataSource<Role>(res.data);
                    this.dealRoleCheck();
                } else {

                }
            });
    }

    toBeforePage() {
        history.go(-1)
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

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.roleArr.data.length;
        return numSelected == numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.roleArr.data.forEach(row => this.selection.select(row));
    }

}
