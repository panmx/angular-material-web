import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotaddSharedModule } from '@notadd/shared.module';

import { HeaderModule } from './header/header.module';
import { ContentComponent } from './content.component';
import {MatIconModule, MatMenuModule} from "@angular/material";

@NgModule({
    imports: [
        NotaddSharedModule,
        HeaderModule,
        RouterModule,
        MatMenuModule,
        MatIconModule,
    ],
    declarations: [ ContentComponent ],
    exports: [ ContentComponent ]
})
export class ContentModule {
}
