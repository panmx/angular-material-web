import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {User} from './../../entity/user/user.entity';
import {HttpErrorHandler, HandleError} from './../../http-error-handler.service';
import {environment} from '@env';
import {StorageUtil} from './../../utils/storage.util';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    }),
    withCredentials: true
};

@Injectable()
export class UserService {
    // private baseUrl = environment.apiUrl;
    private beforeUrl = '/v1';
    private handleError: HandleError;

    constructor(private http: HttpClient,
                httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('UserService');
    }

    /*登录*/
    login(user: User): Observable<User> {
        return this.http.post<User>('/login/login', user, httpOptions)
            .pipe(
                catchError(this.handleError('login', user))
            );
    }

    /*分页查询用户列表*/
    findUserByPage(pageIndex: number, pageSize: number, searchName: string): Observable<any> {
        let url = this.beforeUrl + '/user/find/' + pageIndex + '/' + pageSize + '?searchName=' + searchName;
        return this.http.get<any>(url, httpOptions)
            .pipe(
                catchError(this.handleError('findUserByPage', ''))
            );
    }

    /*修改用户密码*/
    updatePwd(param: any): Observable<any> {
        let url = this.beforeUrl + '/user/update-pass';
        return this.http.put<any>(url, param, httpOptions)
            .pipe(
                catchError(this.handleError('updatePwd', ''))
            );
    }

    /*查询角色列表*/
    findRole(pageIndex: number, pageSize: number): Observable<any> {
        let url = this.beforeUrl + '/role/1/' + pageIndex + '/' + pageSize;
        return this.http.get<any>(url, httpOptions)
            .pipe(
                catchError(this.handleError('findRole', pageIndex))
            );
    }

    /*查询角色详情*/
    findRoleDetail(roleId: any): Observable<any> {
        let url = this.beforeUrl + '/role/sub/' + roleId;
        return this.http.get<any>(url, httpOptions)
            .pipe(
                catchError(this.handleError('findRoleDetail', roleId))
            );
    }

    /*新增角色*/
    saveRole(param: any): Observable<any> {
        let url = this.beforeUrl + '/role/save';
        return this.http.put<any>(url, param, httpOptions)
            .pipe(
                catchError(this.handleError('saveRole', ''))
            );
    }

    /*修改角色*/
    updateRole(param: any): Observable<any> {
        let url = this.beforeUrl + '/role/update';
        return this.http.put<any>(url, param, httpOptions)
            .pipe(
                catchError(this.handleError('updateRole', ''))
            );
    }

    /*修改用户角色*/
    updateUserRole(param: any): Observable<any> {
        let url = this.beforeUrl + '/user/save/userRole';
        return this.http.post<any>(url, param, httpOptions)
            .pipe(
                catchError(this.handleError('updateUserRole', ''))
            );
    }

    /*查询用户信息*/
    findUser(user: any): Observable<User> {
        if(!user){
            user = StorageUtil.getItem(StorageUtil.storageKey.user_encodeUser);
            user.userCode = (user && user['userCode'] ? user['userCode'] : '');
        }
        let url = this.beforeUrl + '/user/find/' + user.userCode;
        return this.http.get<User>(url, httpOptions)
            .pipe(
                catchError(this.handleError('findUser', user))
            );
    }

    /*根据用户id查询菜单*/
    findMenu(userId: string): Observable<User> {
        let user: User
        if (!userId) {
            user = StorageUtil.getItem(StorageUtil.storageKey.user_loginInfo)
            userId = (user && user['userId'] ? user['userId'] : '')
        }
        let url = this.beforeUrl + '/menus/find/' + userId
        return this.http.get<User>(url, httpOptions)
            .pipe(
                catchError(this.handleError('findMenu', user))
            );
    }

    // 文件上传
    uploadFile(data: any): Observable<User> {
        let url = this.beforeUrl + '/process/uploadFile';
        let options = {
            withCredentials: true,
        };
        return this.http.post<any>(url, data, options)
            .pipe(
                catchError(this.handleError('uploadFile', data))
            );
    }

    // 保存用户信息
    saveUser(user: any): Observable<User> {
        let url = this.beforeUrl + '/user/save';
        return this.http.put<any>(url, user, httpOptions)
            .pipe(
                catchError(this.handleError('saveUser', user))
            );
    }

    // 修改用户信息
    updateUser(user: any): Observable<User> {
        let url = this.beforeUrl + '/user/update/user';
        return this.http.post<any>(url, user, httpOptions)
            .pipe(
                catchError(this.handleError('updateUser', user))
            );
    }


}
