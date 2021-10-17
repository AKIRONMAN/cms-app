import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import {RouterModule, Routes} from "@angular/router";
import {FormModule} from "./forms/form.module";
import {AuthGuardService} from "./services/authguard.service";
import {UserService} from "./services/user.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {HttpInterceptorService} from "./services/http-interceptor-service/http-interceptor.service";
const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuardService],
    data: {path: 'home'},
    loadChildren:  () => import('./modules/home/home.module').then(m => m.HomeModule)
  }, {
    path: 'login',
    canActivate: [AuthGuardService],
    data: {path: 'login'},
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  { path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuardService, UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
