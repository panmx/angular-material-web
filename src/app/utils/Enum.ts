/*枚举对象*/
export let Enum = {
    taskLevelList: [ // 帖子紧急程度
        {label: '低', value: 0},
        {label: '中', value: 1},
        {label: '高', value: 2},
        {label: '急', value: 3},
    ],
    userTaskStateList: [ // 用户帖子完成状态
        {label: '未完成', value: 1},
        // {label: '已转交', value: -1},
        {label: '已完成', value: 999},
    ],
    userTaskDescpList: [ // 任务类型
        {label: '需求分析', value: 1},
        {label: '前端开发', value: 2},
        {label: '后端开发', value: 3},
        {label: '功能测试', value: 4},
        {label: '实施', value: 5},
    ],
    userStateList: [ // 用户状态
        {label: '启用', value: 1},
        {label: '禁用', value: 0}
    ],
    roleTypeList: [ // 角色类型
        {label: '管理员', value: 1},
        {label: '需求分析', value: 2},
        {label: '前端', value: 3},
        {label: '后端', value: 4},
        {label: '测试', value: 5},
        {label: '实施', value: 6},
        {label: '维护', value: 7},
    ],
};
