import {StorageUtil} from './storage.util';

export let ToolsUtils = {
    /**
     * 获取路径参数
     */
    getUrlParam: function (url) {
        let theRequest = new Object();
        if (url.indexOf("?") != -1) { //获取url中"?"符后的字串
            let strArr = url.split('?');
            let strs = strArr[1].split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    treeObj: function (originObj) {
        //对象深拷贝
        let obj = {};
        obj = JSON.parse(JSON.stringify(originObj))
//                                for(let key in originObj) {
//                                    let val = originObj[key];
//                                    obj[key] = typeof val === 'object' ? arguments.callee(val) : val;
//                                }
        //对象新增children键值，用于存放子树
        obj['children'] = [];
        return obj;
    },
    /**
     * 将js数组转换成tree树形结构数组
     * @param data
     * @param attributes
     * @returns {Array}
     */
    toTreeData: function (data, attributes) {
        data.sort(function (a, b) { // 菜单排序
            return a.sort - b.sort;
        })
        let resData = data;
        let tree = [];

        //找寻根节点
        for (let i = 0; i < resData.length; i++) {
            if (resData[i][attributes.parentId] === '' || resData[i][attributes.parentId] === null) {
                tree.push(ToolsUtils.treeObj(resData[i]));
                resData.splice(i, 1);
                i--;
            }
        }

        //找寻子树
        let run = function (chiArr) {
            if (resData.length !== 0) {
                for (let i = 0; i < chiArr.length; i++) {
                    for (let j = 0; j < resData.length; j++) {
                        if (chiArr[i][attributes.id] === resData[j][attributes.parentId]) {
                            let obj = ToolsUtils.treeObj(resData[j]);
                            chiArr[i][attributes.children].push(obj);
                            resData.splice(j, 1);
                            j--;
                        }
                    }
                    run(chiArr[i][attributes.children]);
                }
            }
        }

        run(tree);

        return tree;

    },
    /**
     *  判断是否有增删改查权限
     */
    checkPermission: function (url) {
        let permissionObj = {
            isSearchPermission: false,  // 是否有查询权限
            isAddPermission: false, // 是否有新增权限
            isEditPermission: false, // 是否有编辑权限
            isDeletePermission: false, // 是否有删除权限
        };
        let user = StorageUtil.getItem(StorageUtil.storageKey.user_loginInfo);
        if (user && user.adminState && user.adminState === 1) { // 超级管理员拥有全部菜单的增删改查权限
            permissionObj = {
                isSearchPermission: true,  // 是否有查询权限
                isAddPermission: true, // 是否有新增权限
                isEditPermission: true, // 是否有编辑权限
                isDeletePermission: true, // 是否有删除权限
            };
            return permissionObj
        }

        let menuList = StorageUtil.getItem(StorageUtil.storageKey.user_menuList);
        url = url ? url.split('?')[0] : '';
        url = url.replace('/', '');
        let filterChilren = function (child) {
            for (let i = 0; i < child.length; i++) {
                if (child[i].menuUrl && url && url === child[i].menuUrl.replace('/', '')) {
                    permissionObj.isSearchPermission = true;
                    if (child[i].addAuthority) {
                        permissionObj.isAddPermission = true
                    }
                    if (child[i].updateAuthority) {
                        permissionObj.isEditPermission = true
                    }
                    if (child[i].deleteAuthority) {
                        permissionObj.isDeletePermission = true
                    }
                    break
                } else if (child[i].childMenus && child[i].childMenus.length) {
                    filterChilren(child[i].childMenus)
                }
            }
        };
        if (menuList && menuList.length) {
            for (let a = 0; a < menuList.length; a++) {
                if (menuList[a].menuUrl && url && url === menuList[a].menuUrl.replace('/', '')) {
                    permissionObj.isSearchPermission = true;
                    if (menuList[a].addAuthority) {
                        permissionObj.isAddPermission = true
                    }
                    if (menuList[a].updateAuthority) {
                        permissionObj.isEditPermission = true
                    }
                    if (menuList[a].deleteAuthority) {
                        permissionObj.isDeletePermission = true
                    }
                    break
                } else if (menuList[a].childMenus && menuList[a].childMenus.length) {
                    filterChilren(menuList[a].childMenus)
                }
            }
        }
        return permissionObj
    },
    // 文件流转BinaryString
    fixdata(data) {
        let o = "",
            l = 0,
            w = 10240;
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    },
    // 判断是否为json字符串
    isJsonString: function (str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch (e) {
        }
        return false;
    },

    /**
     * 图片上传前校验
     * @param file
     * @returns {boolean}
     */
    beforeUploadImgCheck(file) {
        let str = '';
        let type = '';
        let size = '';
        for(let i = 0; i < file.length; i++) { // 多文件上传
            const isJPG = (file[i].type === 'image/jpeg') || (file[i].type === 'image/png') || (file[i].type === 'image/gif') || (file[i].type === 'image/bmp') || (file[i].type === 'image/x-icon');
            const isLt1M = file[i].size / 1024 / 1024 < 5;
            if(!isJPG) {
                type += '、' + file[i].name
            }
            if(!isLt1M) {
                size += '、' + file[i].name
            }
        }
        if(type) {
            type = type.substr(1, type.length);
            str += '上传的图片只能是 jpg/png/gif/bmp/x-icon 格式。图片' + type + '不在指定图片格式范围内！';
        }
        if(size) {
            size = size.substr(1, size.length);
            str += '上传图片的大小不能超过 5MB。图片' + size + '的大小超出指定范围！';
        }
        if(str) {
            alert(str);
            return false
        } else {
            return true
        }
    },

    /**
     * 数组去重
     * @param array
     * @param key
     * @returns {Array}
     */
    uniqueByKey(array, key){
        let temp = []; //一个新的临时数组
        let tempArr = [];
        for(let i = 0; i < array.length; i++){
            if(temp.indexOf(array[i][key]) == -1){
                temp.push(array[i][key]);
                tempArr.push(array[i])
            }
        }
        return tempArr;
    }
};
