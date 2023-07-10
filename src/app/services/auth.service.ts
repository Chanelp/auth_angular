import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURl = environment.API_URL;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string){
    return this.http.post<ResponseLogin>(`${this.apiURl}api/v1/auth/login`, {email, password})
    .pipe(
      tap(response =>{
        this.tokenService.saveToken(response.access_token)
      }));
  }

  register(name: string, email: string, password: string){
    return this.http.post(`${this.apiURl}api/v1/auth/register`, {name, email, password});
  }

  isAvailable(email: string){
    return this.http.post<{isAvailable: boolean}>(`${this.apiURl}api/v1/auth/is-available`, {email});
  }

  registerAndLogin(name: string, email: string, password: string){
    return this.register(name, email, password)
    .pipe(
      switchMap(() => this.login(email, password))
    )
  }

  recovery(email: string){
    return this.http.post(`${this.apiURl}api/v1/auth/recovery`, { email});
  }

  changePassword(token: string, newPassword: string){
    return this.http.post(`${this.apiURl}api/v1/auth/change-password`, {token, newPassword})
  }
}
