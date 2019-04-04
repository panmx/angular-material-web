import {NgModule} from '@angular/core';

import {NotaddSharedModule} from '@notadd/shared.module';

import {RoleRoutingModule} from './role-routing.module';
import {RoleListComponent} from './role-list/roleList.component';
import {RoleAddComponent} from './role-form/roleAdd.component';
import {RoleEditComponent} from './role-form/roleEdit.component';

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
    MatRadioModule,
    MatTreeModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxCaptchaModule} from 'ngx-captcha';

@NgModule(
    {
        imports: [
            NotaddSharedModule,
            RoleRoutingModule,
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
            MatTreeModule,

            NgxCaptchaModule,

        ],
        declarations: [
            RoleListComponent,
            RoleAddComponent,
            RoleEditComponent
        ],
        providers: [

        ]
    }
)
export class RoleModule {
}
