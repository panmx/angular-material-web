import {Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";
import {SimpleReuseStrategy} from "../../../SimpleReuseStrategy";
import {environment} from '@env';

@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentComponent implements OnInit {
    @Input() public tagsList: any;
    @Input() isMobile: boolean;
    @Input() hasHeader: boolean;
    @Input() notaddConfig: any;

    @Output() tagsEvent: EventEmitter<any> = new EventEmitter();
    visible = false;

    constructor(private router: Router) {

    }

    ngOnInit() {
    }

    toPage(item) {
        this.router.navigateByUrl(item.path);
    }

    /**
     * 关闭指定标签
     * @param index
     */
    closeTags(index) {
        if(this.tagsList && this.tagsList.length == 1 && this.tagsList[0].path.indexOf('/user/person')>=0){
            return;
        }else{
            const delItem = this.tagsList.splice(index, 1)[0];
            const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
            if (item) {
                if (delItem.path === this.router.url) {
                    this.router.navigateByUrl(item.path);
                }
                // 删除复用
                let path = delItem.path.replace(/\//g, '_') + '_' +  delItem.componentName;
                SimpleReuseStrategy.deleteRouteSnapshot(path);
            } else {
                this.router.navigateByUrl('/user/person');
            }
            // 通过emit将信息发射出去
            this.tagsEvent.emit(this.tagsList);
        }

    }

    /**
     * 关闭其他
     */
    closeOther(){
        this.router.navigateByUrl(this.router.url);
        const curItem = this.tagsList.filter(item => {
            if(item.path === this.router.url){
                return true;
            }else{
                // 删除复用
                let path = item.path.replace(/\//g, '_') + '_' +  item.componentName;
                SimpleReuseStrategy.deleteRouteSnapshot(path);
                return false;
            }
            return item.path === this.router.url;
        });
        this.tagsList = curItem;
        // 通过emit将信息发射出去
        this.tagsEvent.emit(this.tagsList);
    }

    /**
     * 关闭全部标签
     */
    closeAll(){
        const curItem = this.tagsList.filter(item => {
            // 删除复用
            let path = item.path.replace(/\//g, '_')+ '_' +  item.componentName;
            SimpleReuseStrategy.deleteRouteSnapshot(path);
        });
        this.tagsList = [];
        // 通过emit将信息发射出去
        this.tagsEvent.emit(this.tagsList);
        this.router.navigateByUrl('/user/person');
    }

    // 右键菜单刷新
    refreshClick(){

    }

    // 右键菜单关闭
    closeTagsBySelectedTag(){

    }

    // 右键菜单关闭其他
    closeOtherBySelectedTag(){

    }
}
