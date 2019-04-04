import {HttpResult} from '../http.result'
import {Role} from "./role.entity";

/**
 * 用户类
 */
export class User extends HttpResult{
    userId: string; // 用户id
    userCode: string; // 账号
    userName: string; // 姓名
    userPhone: string;
    userEmail: string;
    password: string; // 密码
    rePassword: string;  // 确认密码
    createUser: string;
    createUserName: string;
    createDate: string;
    updateUser: string;
    updateUserName: string;
    updateDate: string;
    state: number;
    endDate: string;
    adminState: number; // 角色，adminState为1：管理员
    roleName: string;
    roleList: Array<Role>; // 角色列表

    constructor() {
        super()
    }
}
