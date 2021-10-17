import { NgModule } from '@angular/core';
import {HomeComponent} from "./home.component";
import {UserComponent} from "./user/user.component";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {UserFormComponent} from "./user/user-form/user-form.component";
import {AddUserComponent} from "./user/add-user/add-user.component";
import {FormModule} from "../../forms/form.module";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
const routes: Routes = [
  {
    path: 'users',
    component: UserComponent
  },
  { path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    UserComponent,
    AddUserComponent,
    UserFormComponent
  ],
  imports: [
    FormModule,
    FormsModule,
    CommonModule,
    NgbModule,
    RouterModule.forChild(routes)
  ],
  providers: []
})
export class HomeModule { }
