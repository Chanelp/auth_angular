import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { environment } from '@environments/environment';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = environment.API_URL;

  constructor(private http:HttpClient, private tokenService: TokenService) { }

  getUsers(){
    const token = this.tokenService.getToken();

    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(`${this.apiUrl}api/v1/users`, {headers: headers});
  }
}
