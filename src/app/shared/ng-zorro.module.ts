import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzCarouselModule} from "ng-zorro-antd/carousel";
import {NzCalendarModule} from "ng-zorro-antd/calendar";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzUploadModule} from "ng-zorro-antd/upload";

@NgModule({
  exports: [
    NzButtonModule,
    NzListModule,
    NzTypographyModule,
    NzModalModule,
    NzCarouselModule,
    NzCalendarModule,
    NzCardModule,
    NzFormModule,
    NzAlertModule,
    NzToolTipModule,
    NzUploadModule
  ],
  imports: [
    CommonModule,
    NzButtonModule,
    NzListModule,
    NzTypographyModule,
    NzModalModule,
    NzCarouselModule,
    NzCalendarModule,
    NzCardModule,
    NzFormModule,
    NzAlertModule,
    NzToolTipModule,
    NzUploadModule
  ]
})

export class NgZorroModule {}
