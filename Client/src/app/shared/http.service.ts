import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  login(loginData: any): Observable<any> {
    return new Observable((observer) => {
      observer.next({status: true, username: loginData.username})
      observer.complete()
    })
  }
}
