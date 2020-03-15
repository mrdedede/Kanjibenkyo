import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  login(loginData: any): Observable<any> {
    return new Observable((observer) => {
      observer.next({status: true, username: loginData.username})
      observer.complete()
    })
  }

  testBackend() {
    let headers = new HttpHeaders()
    .set('Authorization', 'my-auth-token')
    .set('Content-Type', 'application/json')
    this.http.get<string>("http://localhost:8000/", {headers: headers}).subscribe((response) => {
      console.log(response)
    })
  }
}