import {Injectable} from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
    HttpHeaderResponse,
    HttpResponse,
    HttpEvent
} from "@angular/common/http";
import {Observable} from "rxjs";
import {finalize, tap} from "rxjs/operators";
import {environment} from '@env';
// import { LoadingService } from "../loading/loading.service";
import {StorageUtil} from './utils/storage.util';
import {Router} from '@angular/router';

/*http请求拦截类*/
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private router: Router,
                // private loadingService: LoadingService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // var token = StorageUtil.getItem(StorageUtil.storageKey.token)
        let url = req.url
        if ((req.url.indexOf('http://') < 0 || req.url.indexOf('https://') < 0) && req.url.indexOf('assets/') != 0) {
            url = req.url.replace(req.url, environment.apiUrl + req.url)
        }
        // req.clone方法设置headers,url，...等参数时，value不能为空，否则报错，例如，如果token的值为空，就会报错
        const authReq = req.clone({
            // headers: req.headers.set("token", token),
            url: url,
            withCredentials: true
        });
        return next.handle(authReq).pipe(
            tap(
                event => {
                    window['isTowAlertLogin'] = 1;
                    // this.loadingService.loading(true);
                    if (event instanceof HttpResponse) {

                    }
                },
                error => {
                    if (window['isTowAlertLogin'] != 2 && StorageUtil.getItem(StorageUtil.storageKey.isLogin) && error.error && error.error.message && error.error.message.indexOf('重新登录') >= 0) {
                        window['isTowAlertLogin'] = 2;
                        alert('会话过期，请重新登录！');
                        StorageUtil.setItem(StorageUtil.storageKey.isLogin, false);
                        this.router.navigateByUrl('/common/login');
                    }
                }
            ),
            finalize(() => {//请求完成（成功或失败都执行）
                // this.loadingService.loading(false);
            })
        );
    }
}
