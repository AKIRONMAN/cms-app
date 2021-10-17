import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {of, throwError} from "rxjs";

export interface CredentialInterface{
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  static readonly CREDENTIAL_KEY_NAME: string = 'login-access-token';
  readonly USER_DATA_KEY_NAME: string = 'user-data';
  private __loggedInUser__: any; // logged in user data
  private __savedCredentials__: any; // storing the credentials in service because no need to call or load json file again
  constructor(private http: HttpClient) { }

  getList(){
    return this.http.get('/apis/v1/users/');
  }

  search(filter: any){
    return this.http.get('/apis/v1/users/search', filter);
  }

  getUserDataInJsonObject(usersData: string){
    let userList = [];
    try{
      userList = JSON.parse(usersData);
    }catch(e){
    }
    return userList;
  }

  add(userData: any){
    return this.http.post('/apis/v1/users/', userData);
  }

  update(id:any, userData: any){
    return this.http.put(`/apis/v1/users/${id}/update`, userData);
  }

  deleteUser(userId: any){
    return this.http.delete(`/apis/v1/users/${userId}`);
  }

  login(credential: CredentialInterface){
    if(this.__savedCredentials__ && this.__savedCredentials__.username){
      // Checking via cached data no need to load json file again
      return this.__loggedInUser__;
    }else {
      // if cached is not there then we have to load json file again
      return this.http.put('/apis/v1/users/login', credential)
        .pipe(map((data: any) => {
          this.__loggedInUser__ = data;
          this.getResAfterCheckLoginCredentials(data)
          return data;
        }), catchError((error) => {
          return throwError(error);
        }));
    }
  }

  // it checks Credential of a user an give data to to send to component
  getResAfterCheckLoginCredentials(userData: any){
    localStorage.setItem(UserService.CREDENTIAL_KEY_NAME, btoa(userData.accessToken));
  }

  // return boolean if user is logged in or not
   isLoggedIn(){
     const accessToken = localStorage.getItem(UserService.CREDENTIAL_KEY_NAME);
    return !!this.__loggedInUser__ || accessToken;
  }

  logout(){
    localStorage.removeItem(UserService.CREDENTIAL_KEY_NAME);
    window.location.reload();
  }
}
