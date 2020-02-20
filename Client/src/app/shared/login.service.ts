import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  logged: boolean = false
  user: string

  constructor(private httpService: HttpService) { }

  login(): Observable<any> {
    return this.httpService.login()
  }
}