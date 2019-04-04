import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user.service';
import {User} from '../../../entity/user/user.entity';
import {StorageUtil} from '../../../utils/storage.util';
import {MessageService} from "../../../message.service";

@Component({
    selector: 'person',
    templateUrl: './person.component.html',
    styleUrls: ['./person.component.scss'],
    providers: [UserService]
})
export class PersonComponent implements OnInit {
    user = new User();
    isLoadUpdatePwd = false;
    updatePwdObj = {
        userCode: '',
        oldPassword: '',
        password: '',
        rePassword: ''
    };

    constructor(private userService: UserService,
                private messageService: MessageService) {
    }

    ngOnInit() {
        this.calcHeight();
        // 监听窗口大小
        let _this = this;
        window.onresize=function(){
            _this.calcHeight();
        };

        let user = StorageUtil.getItem(StorageUtil.storageKey.user_encodeUser);
        this.updatePwdObj.userCode = user['userCode'];
        this.findUser()

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

    updatePwd() {
        let str = '';
        this.updatePwdObj.oldPassword = this.updatePwdObj.oldPassword.trim();
        this.updatePwdObj.password = this.updatePwdObj.password.trim();
        this.updatePwdObj.rePassword = this.updatePwdObj.rePassword.trim();
        if (!this.updatePwdObj.oldPassword) {
            str += '、旧密码'
        }
        if (!this.updatePwdObj.password) {
            str += '、新密码'
        }
        if (!this.updatePwdObj.rePassword) {
            str += '、确认密码'
        }
        if (str) {
            str = str.substr(1, str.length);
            alert(str + '不能为空！');
            return false;
        } else {
            if (this.updatePwdObj.password != this.updatePwdObj.rePassword) {
                alert('新密码和确认密码不一致!');
                return false;
            }
        }
        this.isLoadUpdatePwd = true;
        this.userService.updatePwd(this.updatePwdObj)
            .subscribe(res => {
                this.isLoadUpdatePwd = false;
                if (res && res["success"]) {
                   alert('修改密码成功！');
                   let userCode = this.updatePwdObj.userCode
                   this.updatePwdObj = {
                       userCode: userCode,
                       oldPassword: '',
                       password: '',
                       rePassword: ''
                   };
                } else                    {
                    alert('修改密码失败！' + res['errMessage'])
                }
            });
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
                    this.messageService.sendMessage({key: 'userInfo', value: res.data});
                    StorageUtil.setItem(StorageUtil.storageKey.user_loginInfo, res.data);
                } else {

                }
            });
    }
}
