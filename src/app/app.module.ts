import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatPaginatorIntl, MatIconModule, MatButtonModule, MatDialogModule } from '@angular/material';
import 'hammerjs';

import { NgForageModule, NgForageConfig, Driver } from 'ngforage';
import { NgxPermissionsModule } from 'ngx-permissions';

import { NotaddModule } from '@notadd/notadd.module';
import { NotaddMatIconsModule } from '@notadd/mat-icons/mat-icons.module';
import { NotaddProgressBarModule, NotaddSidebarModule, NotaddThemePanelModule } from '@notadd/components';
import { NotaddMatPaginatorIntlService } from '@notadd/services/notadd-mat-paginator-intl.service';

import { LayoutModule } from './layout/layout.module';

import { notaddConfig } from './config/notadd.config';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env';
import { AuthService } from './auth.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';
import {HttpInterceptorService} from "./http.interceptor.service";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {SimpleReuseStrategy} from "./SimpleReuseStrategy";
import {RouteReuseStrategy} from "@angular/router";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,

        NgxPermissionsModule.forRoot(),

        /* @notadd modules */
        NotaddModule.forRoot(notaddConfig),
        NotaddMatIconsModule,
        NotaddProgressBarModule,
        NotaddSidebarModule,
        NotaddThemePanelModule,

        LayoutModule,

        HttpClientModule,

        AppRoutingModule,

        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

    ],
    providers: [
        AuthService,
        HttpErrorHandler,
        MessageService,
        {provide: MatPaginatorIntl, useClass: NotaddMatPaginatorIntlService }, // material.angular 分页汉化
        {provide:HTTP_INTERCEPTORS, useClass:HttpInterceptorService, multi:true}, // http请求拦截
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' }, //注意 moment 是 zh-CN 和 ng 不一样 /.\
        { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
    constructor(ngfConfig: NgForageConfig) {
        /* configuration NgForage*/
        ngfConfig.configure({
            name: 'Task',
            driver: [ // defaults to indexedDB -> webSQL -> localStorage
                Driver.INDEXED_DB,
                Driver.LOCAL_STORAGE
            ]
        });
    }
}
