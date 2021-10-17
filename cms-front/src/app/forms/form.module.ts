import { NgModule } from '@angular/core';
import {AppInputTextComponent} from "./app-input-text/app-input-text.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    AppInputTextComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [AppInputTextComponent],
  providers: []
})
export class FormModule { }
