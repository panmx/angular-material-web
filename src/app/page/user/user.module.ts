import {NgModule} from '@angular/core';

import {NotaddSharedModule} from '@notadd/shared.module';

import {UserRoutingModule} from './user-routing.module';
import {PersonComponent} from './person/person.component';
import {UserListComponent} from './user-list/userList.component';
import {UserEditComponent} from './user-form/userEdit.component';
import {UserAddComponent} from './user-form/userAdd.component';

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
    MatProgressBarModule,
    MatTableModule,
    MatChipsModule,
    MatSelectModule,
    MatOptionModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxCaptchaModule} from 'ngx-captcha';

@NgModule(
    {
        imports: [
            NotaddSharedModule,
            UserRoutingModule,
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
            MatTableModule,
            FormsModule,
            ReactiveFormsModule,
            MatChipsModule,
            MatSelectModule,
            MatOptionModule,
            MatPaginatorModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatRadioModule,

            NgxCaptchaModule,

        ],
        declarations: [
            PersonComponent,
            UserListComponent,
            UserEditComponent,
            UserAddComponent
        ],
        providers: [

        ]
    }
)
export class UserModule {
}
