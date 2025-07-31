import {NgModule} from "@angular/core";
import {HomeModule} from "../features/home/home.module";
import {AuthModule} from "../features/auth/auth.module";
import {LayoutModule} from "../layout/layout.module";
import {ErrorPagesModule} from "../features/error-pages/error-pages.module";

@NgModule({
  imports: [
    HomeModule,
    AuthModule,
    LayoutModule,
    ErrorPagesModule,
  ],
  exports: [
    HomeModule,
    AuthModule,
    LayoutModule,
    ErrorPagesModule,
  ]
})
export class FeatureModule {}
