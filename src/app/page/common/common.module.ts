import { NgModule } from '@angular/core';
import {
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatProgressBarModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxCaptchaModule } from 'ngx-captcha';

import { NotaddSharedModule } from '@notadd/shared.module';

import { CommonRoutingModule } from './common-routing.module';
import { ErrorsComponent } from './errors/errors.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatProgressBarModule,
        FormsModule,
        ReactiveFormsModule,

        NgxCaptchaModule,

        NotaddSharedModule,

        CommonRoutingModule
    ],
    declarations: [
        ErrorsComponent,
        LoginComponent,
        ForgotPasswordComponent,
        LockscreenComponent,
        RegisterComponent
    ]
})
export class CommonModule {
}
