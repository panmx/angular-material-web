import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {User} from '../../../entity/user/user.entity';
import {UserService} from '../../../service/user/user.service';
import {Base64Util} from '../../../utils/base64.util'
import {StorageUtil} from '../../../utils/storage.util'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [UserService]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isLoading: boolean;

    constructor(private formBuilder: FormBuilder,
                private snackBar: MatSnackBar,
                private router: Router,
                private userService: UserService) {
        this.isLoading = false;
    }

    ngOnInit() {
        let encodeUser = StorageUtil.getItem(StorageUtil.storageKey.user_encodeUser);
        encodeUser = encodeUser ? encodeUser : {};
        let userCode = 'admin';
        let password = 'admin';
        let rememberMe = false;
        if (encodeUser.userCode && encodeUser.password) {
            let b = new Base64Util.Base64();
            let pwd = b.decode(encodeUser.password);
            userCode = encodeUser.userCode;
            password = pwd;
            rememberMe = encodeUser.rememberMe ? encodeUser.rememberMe : false
        }
        this.loginForm = this.formBuilder.group({
            userCode: [userCode, Validators.required],
            rememberMe: [rememberMe],
            password: [password, Validators.required]
        });
    }

    get userCode() {
        return this.loginForm.get('userCode');
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }

    onSubmit() {
        this.isLoading = true;
        this.login();
    }

    login() {
        this.userService.login(this.loginForm.value)
            .subscribe(res => {
                this.isLoading = false;
                let a = {"success":true,"code":1,"errMessage":"","errDate":null,"data":null,"count":0};
                if (a["success"]) {
                    localStorage.clear(); // 登录成功，清除全部缓存

                    let b = new Base64Util.Base64();
                    if (this.loginForm.value.rememberMe) {  // 自动登录，密码加密
                        let pwd = b.encode(this.loginForm.value.password);
                        let user = {
                            userCode: this.loginForm.value.userCode,
                            password: pwd,
                            rememberMe: this.loginForm.value.rememberMe
                        };
                        StorageUtil.setItem(StorageUtil.storageKey.user_encodeUser, user)
                    } else {
                        let user = {
                            userCode: this.loginForm.value.userCode,
                            password: '',
                            rememberMe: false
                        };
                        StorageUtil.setItem(StorageUtil.storageKey.user_encodeUser, user)
                    }
                    // 登录成功，跳转个人页面
                    StorageUtil.setItem(StorageUtil.storageKey.isLogin, true);
                    this.router.navigateByUrl('/user/person');
                } else {
                    this.openSnackBar(a["errMessage"] ? a["errMessage"] : '登录失败！');
                }
            });

    }

    openSnackBar(message) {
        this.snackBar.open(message, '确定 👌', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }
}
