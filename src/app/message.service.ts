import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs/index";

@Injectable()
/**
 * 数据共享服务，组件通信类
 */
export class MessageService {
    constructor() { }
    private subject = new Subject<any>();

    sendMessage(message: any) {
        this.subject.next(message);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
