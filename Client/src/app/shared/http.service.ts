import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor() { }

  login(): Observable<any> {
    return new Observable((observer) => {
      observer.next({status: true, username: "Dummy"})
      observer.complete()
    })
  }
}
