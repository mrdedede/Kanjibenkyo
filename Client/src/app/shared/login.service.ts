import { Injectable, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  logged: boolean = false
  user: string

  constructor(private httpService: HttpService) { }

  /**
   * This function shall send the data to the Http Service.
   * @param loginData {Object} - Data from the Log In form
   */
  login(loginData: Object): Observable<any> {
    return this.httpService.login(loginData)
  }

  testBackend() {
    this.httpService.testBackend()
  }

  /**
   * This function shall send the validated data to the Http Service
   * @param signUpData {Object} - Validated data from the Sign Up form
   */
  signup(signUpData: Object) {
    this.httpService.signup(signUpData)
  }
}