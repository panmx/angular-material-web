import {Component, OnInit} from '@angular/core';
import {Role} from '../../../entity/user/role.entity';
import {UserService} from '../../../service/user/user.service';
import {StorageUtil} from '../../../utils/storage.util';
import {Router} from '@angular/router';
import {Enum} from '../../../utils/Enum';
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material";
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SimpleReuseStrategy} from "../../../SimpleReuseStrategy";
import {FlatTreeControl} from "@angular/cdk/tree";
import {Menu} from "../../../entity/user/menu.entity";
import {ToolsUtils} from "../../../utils/tools.util";

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode extends Menu{
    constructor(){super()}
    level: number;
    expandable: boolean;
}

@Component({
    selector: 'roleAdd',
    templateUrl: './roleAdd.component.html',
    styleUrls: ['./roleAdd.component.scss'],
    providers: [UserService]
})
export class RoleAddComponent implements OnInit {
    isLoading: boolean;
    role = new Role();
    stateList = Enum.userStateList;
    roleArr = new MatTableDataSource<Role>([]);
    displayedColumns = ['select', 'roleName', 'description', 'roleType',
        'state'];
    userStateList = Enum.userStateList;
    roleTypeList = Enum.roleTypeList;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TodoItemFlatNode, Menu>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<Menu, TodoItemFlatNode>();

    treeControl: FlatTreeControl<TodoItemFlatNode>;

    treeFlattener: MatTreeFlattener<Menu, TodoItemFlatNode>;

    treeSource: MatTreeFlatDataSource<Menu, TodoItemFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
    menusList: Menu[];

    constructor(private userService: UserService,
                private router: Router) {
        this.isLoading = false;
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.treeSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        this.menusList = StorageUtil.getItem(StorageUtil.storageKey.user_menuList);
        this.treeSource.data = this.menusList;
        this.treeControl.expandAll(); // 展开全部tree节点
    }

    ngOnInit() {
        this.role.state = 1;
        this.calcHeight();
        // 监听窗口大小
        let _this = this;
        window.onresize=function(){
            _this.calcHeight();
        };
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

    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getChildren = (node: Menu): Menu[] => node.childMenus;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: Menu, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.menuName === node.menuName
            ? existingNode
            : new TodoItemFlatNode();
        flatNode.id = node.id;
        flatNode.menuName = node.menuName;
        flatNode.parentId = node.parentId;
        flatNode.addAuthorityBoolean = node.addAuthorityBoolean;
        flatNode.updateAuthorityBoolean = node.updateAuthorityBoolean;
        flatNode.deleteAuthorityBoolean = node.deleteAuthorityBoolean;
        flatNode.level = level;
        flatNode.expandable = !!node.childMenus;
        flatNode.childMenus = node.childMenus;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        descendants.filter(child =>{
            this.setMenuAuthority(child); // 选择/不选择菜单权限设置
        });
        this.checkAllParentsSelection(node);
    }

    // 选择/不选择菜单权限设置
    setMenuAuthority(node){
        let isSelected = false;
        this.checklistSelection.selected.filter(row =>{
            if(row.id == node.id){
                isSelected = true;
            }
        });
        if(isSelected){
            node.addAuthorityBoolean = true;
            node.updateAuthorityBoolean = true;
            node.deleteAuthorityBoolean = true;
        } else {
            node.addAuthorityBoolean = false;
            node.updateAuthorityBoolean = false;
            node.deleteAuthorityBoolean = false;
        }

    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
        this.setMenuAuthority(node); // 选择/不选择菜单权限设置
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TodoItemFlatNode): void {
        let parent: TodoItemFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TodoItemFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /* Get the parent node of a node */
    getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    doCheck(){
        let strErr = '';
        if (!this.role.roleName || !this.role.roleName.trim()) {
            strErr += '、角色名称'
        }
        if (!this.role.roleType) {
            strErr += '、角色类型'
        }
        if (strErr) {
            strErr = strErr.substr(1, strErr.length);
            strErr += '不能为空！';
            alert(strErr);
            return false
        } else {
            if (strErr) {
                alert(strErr);
                return false
            } else {
                return true
            }
        }
    }

    // 菜单提交前处理
    dealMenuBeforeSave() {
        let _this = this;
        this.role.menusList = [];
        _this.checklistSelection.selected.filter(function (row) {
            if(row.parentId){
                _this.dealMenuChildrenBeforeSave(row.parentId) // 递归循环子菜单
            }
            row.addAuthority = row.addAuthorityBoolean ? 1 : 0;
            row.updateAuthority = row.updateAuthorityBoolean ? 1 : 0;
            row.deleteAuthority = row.deleteAuthorityBoolean ? 1 : 0;
            _this.role.menusList.push(row);
        })
    }

    // 递归循环子菜单
    dealMenuChildrenBeforeSave(parentId) {
        let _this = this;
        _this.menusList.filter(function (row) {
            if(parentId == row.id){
                _this.role.menusList.push(row);
            }
            if(row.parentId){
                _this.dealMenuChildrenBeforeSave(row.parentId) // 递归循环子菜单
            }
        })
    }

    saveRoleClick(){
        if(!this.doCheck()){
            return;
        }
        let a = this.checklistSelection.selected;
        this.dealMenuBeforeSave(); // 菜单提交前处理
        this.role.menusList = ToolsUtils.uniqueByKey(this.role.menusList, 'id'); // 根据id进行菜单去重
        console.log(this.role.menusList);
        this.isLoading = true;
        this.userService.saveRole(this.role)
            .subscribe(res => {
                this.isLoading = false;
                if (res && res["success"]) {
                   this.closeCurPage();
                   this.router.navigateByUrl('/role/roleList');
                } else {
                    alert('保存失败！' + (res['errMessage'] ? res['errMessage'] : ''))
                }
            });
    }

    // 关闭当前页
    closeCurPage(){
        window['colsePage'] = this.router.url;
        // 删除复用
        SimpleReuseStrategy.deleteRouteSnapshot('_role_roleList_RoleListComponent');
    }

    toBeforePage() {
        history.go(-1)
    }

    getLabel(value, list) {
        let label = '';
        if (list) {
            list.filter(row => {
                if (value != undefined && row.value == value) {
                    label = row.label;
                }
            })
        }
        return label;
    }

}
