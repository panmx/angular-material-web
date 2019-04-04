import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatRippleModule, MatMenuModule } from '@angular/material';

import { NotaddPipesModule } from '@notadd/pipes/pipes.module';
import { NotaddNavigationComponent } from './navigation.component';
import { NotaddNavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { NotaddNavItemComponent } from './nav-item/nav-item.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        MatIconModule,
        MatRippleModule,
        MatMenuModule,

        NotaddPipesModule
    ],
    declarations: [
        NotaddNavigationComponent,
        NotaddNavCollapseComponent,
        NotaddNavItemComponent
    ],
    exports: [
        NotaddNavigationComponent
    ]
})
export class NotaddNavigationModule {
}
