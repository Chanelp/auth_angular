import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '@services/token.service';

const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    if (checkToken().get(CHECK_TOKEN)) {
      return this.addToken(request, next);
    }
    return next.handle(request);
    
  }

  addToken(request: HttpRequest<unknown>, next: HttpHandler) {
    const access_token = this.tokenService.getToken();

    if (access_token) {
      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${access_token}`),
      });

      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }
}
