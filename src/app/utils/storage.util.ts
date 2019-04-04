export var StorageUtil = {
    storageKey: { // 缓存key
        token: '', // sessionid
        isLogin: 'isLogin', // 登录状态，true登录，false未登录
        user_loginInfo: 'user_loginInfo', // 登录用户
        user_encodeUser: 'user_encodeUser', // 登录用户-记住我
        curTaskUserId: 'curTaskUserId', // 当前任务用户
        task_detail: 'task_detail', // 帖子详情
        curCheckedUser: 'curCheckedUser', // 当前选中用户
        user_detail: 'user_detail', // 用户详情
        user_menuList: 'user_menuList', // 用户菜单
        role_detail: 'role_detail', // 角色详情
    },
    getItem: function (key) {
        var str = localStorage.getItem(key);
        if (str && str.length > 2 && ((str.substr(0, 1) == '[' && str.substr(str.length - 1, 1) == ']') || (str.substr(0, 1) == '{' && str.substr(str.length - 1, 1) == '}'))) {
            return JSON.parse(str)
        } else {
            return str
        }
    },
    setItem: function (key, data) {
        if (data && "object" == typeof(data)) {
            localStorage.setItem(key, JSON.stringify(data))
        } else {
            localStorage.setItem(key, data)
        }
    }
};
