import { NgModule } from '@angular/core';
import {LoginComponent} from "./login.component";
import {FormModule} from "../../forms/form.module";
import {RouterModule, Routes} from "@angular/router";
import {UserComponent} from "../home/user/user.component";
import {CommonModule} from "@angular/common";
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  { path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class LoginModule { }
