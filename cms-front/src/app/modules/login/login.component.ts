import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  userNameField: any;
  passwordField: any;
  isApiRunning: boolean = false;
  showLoader: boolean = true;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private toaster: ToastrService,
              private router: Router) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.checkForAlreadyLogin();
    this.buildUserNameField();
    this.buildPasswordField();
  }

  async checkForAlreadyLogin(){
    let data: any = localStorage.getItem(UserService.CREDENTIAL_KEY_NAME);
    console.log(data);
    if(data) {
      data = atob(data);
      try {
        console.log(data);
        data = JSON.parse(data);
        const res = await this.userService.login(data).toPromise();
        if(res && res.code === 200){ // state login
            this.router.navigateByUrl('/home/users');
        }
        this.showLoader = false;
      }catch(e){
        this.showLoader = false;
      }
    }else {
      this.showLoader = false;
    }
  }

  buildUserNameField(){
    this.userNameField = {
      fieldName: 'email',
      value: '',
      displayLabel: 'User Name',
      type: 'Text',
      placeholder: 'Enter your first name'
    }
  }

  buildPasswordField(){
    this.passwordField = {
      fieldName: 'password',
      value: '',
      displayLabel: 'Password',
      type: 'password',
      placeholder: 'Enter your password'
    }
  }

  login(){
      if(this.formGroup.valid){
        this.isApiRunning = true;
        this.userService.login(this.formGroup.value)
          .subscribe((response: any) => {
            this.isApiRunning = false;
            this.checkUserCredentials(response);
          }, (error: any) => {
            this.isApiRunning = false;
            console.log('Error:::', error);
            this.toaster.error(error.message || error.error.message, 'Error');
          })
      }
  }

  checkUserCredentials(data: any){
    if(data && data.accessToken){
      this.toaster.success(data.message, 'Success');
      this.router.navigateByUrl('/home/users');
    }else{
        console.log('Error:::');
      this.toaster.error(data.message, 'Error');
    }
  }
}
