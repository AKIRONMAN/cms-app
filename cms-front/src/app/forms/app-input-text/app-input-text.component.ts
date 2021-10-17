import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-input-text',
  templateUrl: './app-input-text.component.html',
  styleUrls: ['./app-input-text.component.css']
})
export class AppInputTextComponent implements OnInit {
  @Input() fieldMeta: any = {};
  @Input() formGroup: FormGroup = new FormGroup({});
  isBlur: boolean = false;
  errorMessage = 'This field is required.';
  constructor() { }

  ngOnInit(): void {
    this.formGroup.addControl(this.fieldMeta.fieldName, this.getFormControl());
  }

  getFormControl(){
    return new FormControl(this.fieldMeta.value || '', this.getValidations());
  }

  getValidations(){
    const validators = [];
      if(this.fieldMeta){
          switch (this.fieldMeta.type) {
            case 'Text':
              validators.push(Validators.min(2));
              validators.push(Validators.required);
              break;
            case 'Mobile':
              validators.push(Validators.pattern(/^[0-9]{10,12}$/));
              validators.push(Validators.required);
              break;
            case 'Email':
              validators.push(Validators.pattern( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
              validators.push(Validators.required);
              break;
            default:
              validators.push(Validators.required);
              break;
          }
      }
      return validators;
  }

  onBlur(event: any){
    this.isBlur = true;
  }

}
