import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  login(loginData: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', ['localhost:8000'])
    return this.http.post('http://localhost:8000/user/login', loginData, {headers: headers})
  }

  signup(signupData: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', ['localhost:8000'])
    return this.http.post('http://localhost:8000/user/signup', signupData, {headers: headers})
  }
}