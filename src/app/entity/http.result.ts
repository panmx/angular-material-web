// http请求成功后接口返回通用字段定义
export class HttpResult {
    success: boolean;
    code: number;
    errMessage: string;
    errDate: string;
    data: any;
    count: number;

    constructor() {
    }
}
