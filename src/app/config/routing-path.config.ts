export const routingPathConfig = {
    /* application */
    app: {
        default: '',
        common: 'common',
        user: 'user',
        role: 'role',
        wildcard: '**'
    },

    common: {
        default: '',
        errors: 'errors/:code',
        login: 'login',
        register: 'register',
        forgotPassword: 'forgot-password',
        lockscreen: 'lockscreen',
    },

    user: {
        default: '',
        person: 'person',
        userList: 'userList',
        userAdd: 'userAdd',
        userEdit: 'userEdit',
    },

    role: {
        default: '',
        roleList: 'roleList',
        roleAdd: 'roleAdd',
        roleEdit: 'roleEdit',
    },
};
