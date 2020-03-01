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

  login(loginData: any): Observable<any> {
    return this.httpService.login(loginData)
  }

  testBackend() {
    this.httpService.testBackend()
  }
}