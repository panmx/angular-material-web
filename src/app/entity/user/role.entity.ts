import {HttpResult} from "../http.result";
import {Menu} from "./menu.entity";

/**
 * 角色类
 */
export class Role extends HttpResult{
    id: string;
    roleName: string;
    description: string;
    roleType: number;
    createUser: string;
    createUserName: string;
    createDate: string;
    updateUser: string;
    updateUserName: string;
    updateDate: string;
    state: number;
    checked: boolean;
    menusList: Array<Menu>;

    constructor() {
        super()
    }
}
