import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user: any;
  formGroup: FormGroup;
  firstNameField: any;
  passwordField: any;
  lastNameField: any;
  emailField: any;
  aboutField: any;
  mobileField: any;
  status: any;
  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.buildFields();
  }

  buildFields() {
    this.status = this.user && this.user.id ? (this.user.isActive ? 'active' : 'inactive') : 'active';
    this.buildFirstNameField();
    this.buildLastNameField();
    this.buildEmailField();
    this.buildMobileField();
    this.buildAboutField();
    this.buildPasswordField();
  }

  buildPasswordField(){
    this.passwordField = {
      fieldName: 'password',
      value: '',
      type: 'password',
      displayLabel: 'Password',
      placeholder: 'Enter your password'
    }
  }

  buildAboutField(){
    this.aboutField = this.user && this.user.about ? this.user.about: ''
  }

  buildFirstNameField(){
    this.firstNameField = {
      fieldName: 'first',
      value:  this.user && this.user.firstName ? this.user.firstName: '',
      type: 'Text',
      displayLabel: 'First',
      placeholder: 'Enter your first name'
    }
  }

  buildLastNameField(){
    this.lastNameField = {
      fieldName: 'last',
      value:  this.user && this.user.lastName ? this.user.lastName: '',
      type: 'Text',
      displayLabel: 'Last',
      placeholder: 'Enter your last name'
    }
  }

  buildEmailField(){
    this.emailField = {
      fieldName: 'email',
      value: this.user && this.user.email ? this.user.email: '',
      type: 'Email',
      displayLabel: 'Email',
      placeholder: 'Enter your email'
    }
  }

  buildMobileField(){
    this.mobileField = {
      fieldName: 'phone',
      value: this.user && this.user.phone ? this.user.phone: '',
      type: 'Mobile',
      displayLabel: 'Phone',
      placeholder: 'Enter your mobile number'
    }
  }


  // Calling from the parent component
  isFormValid(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();
    }
    return this.formGroup.valid && this.status;
  }

  // to reset form

  resetForm(){
    this.formGroup.reset();
    this.status = 'active';
  }

  getValues(){
    const valuesObject = this.formGroup.value;
    const values  = {
        firstName: valuesObject.first, lastName: valuesObject.last,
      email: valuesObject.email,
      phone: valuesObject.phone,
      password: valuesObject.password,
      about: this.aboutField
    }
    if(this.user && this.user.id && !valuesObject.password){
      delete values.password;
    }
    return {...values, isActive: this.status === 'active', userProfile: 'USER'};
  }

}
