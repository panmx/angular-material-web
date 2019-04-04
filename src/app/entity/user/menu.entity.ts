import {HttpResult} from "../http.result";

/**
 * 菜单类
 */
export class Menu extends HttpResult{
    id: string;
    menuName: string;
    type: any;
    parentId: string;
    menuCode: string;
    menuIcon: string;
    menuUrl: string;
    sort: number;
    state: number;
    addAuthority: number;
    updateAuthority: number;
    deleteAuthority: number;
    createUser: string;
    createUserName: string;
    createDate: string;
    updateUser: string;
    updateUserName: string;
    updateDate: string;
    childMenus: Array<Menu>;
    addAuthorityBoolean: boolean;
    updateAuthorityBoolean: boolean;
    deleteAuthorityBoolean: boolean;

    constructor() {
        super()
    }
}
