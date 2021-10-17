import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { Router } from '@angular/router';
import {UserService} from "../user.service";
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken: any = localStorage.getItem(UserService.CREDENTIAL_KEY_NAME);
    accessToken = atob(accessToken);
    httpRequest = httpRequest.clone({
      method: httpRequest.method,
      headers: httpRequest.headers.set('access-token', accessToken)
    });
    if (!accessToken) {
      this.router.navigate(['/login']);
      return next.handle(httpRequest);
    }
    return next.handle(httpRequest).pipe(map((resp: any) => {
      if (resp instanceof HttpResponse) {
        resp = resp.clone<any>({ body: resp.body.data, });
        return resp;
      }
    }), catchError((error: HttpErrorResponse) => {
      return throwError(error.error.error.message || error.error.message || error.error);
    }));
  }


}
