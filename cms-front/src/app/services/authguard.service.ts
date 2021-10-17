import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const path = route.data && route.data.path;
    if (this.userService.isLoggedIn()) {
      return true;
    }
    if(path !== 'login'){
      this.router.navigateByUrl('login');
      return false;
    }else {
      return true;
    }
  }
}
