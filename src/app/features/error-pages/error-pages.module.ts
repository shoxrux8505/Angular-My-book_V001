import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorPagesRoutingModule } from './error-pages-routing.module';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

import { ErrorReportComponent } from './components/error-report/error-report.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccessDeniedComponent,
       NotFoundComponent,
       ErrorReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ErrorPagesRoutingModule,
    SharedModule,
    FormsModule
],
exports: [
  ErrorReportComponent
]
})
export class ErrorPagesModule { }
