import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', ['localhost:8000'])

  constructor(private http: HttpClient) { }

  login(loginData: any): Observable<any> {
    return this.http.post('http://localhost:8000/user/login', loginData, {headers: this.headers})
  }

  signup(signupData: any): Observable<any> {
    return this.http.post('http://localhost:8000/user/signup', signupData, {headers: this.headers})
  }

  getKanjiLevel(level: number): Observable<any> {
    return this.http.get(`http://localhost:8000/kanji/n${level}`, {headers: this.headers})
  }

  getKanji(level: number, kanji: string): Observable<object> {
    return this.http.get(`http://localhost:8000/kanji/n${level}/${kanji}`, {headers: this.headers})
  }
}