import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', ['localhost:8000'])

  constructor(private http: HttpClient) { }

  /**
   * Logs the user onto the app, sending its data to firebase
   * 
   * @param loginData - Inputted User data
   */
  login(loginData: any): Observable<any> {
    return this.http.post('http://localhost:8000/user/login', loginData, {headers: this.headers})
  }

  /**
   * Creates an account for the user at our firebase instance
   * 
   * @param signupData - Inputted User data
   */
  signup(signupData: any): Observable<any> {
    return this.http.post('http://localhost:8000/user/signup', signupData, {headers: this.headers})
  }


  /**
   * Gets all kanji that is contained in a certain level
   * 
   * @param {number} level - Current Level of studies
   */
  getKanjiLevel(level: number): Observable<any> {
    return this.http.get(`http://localhost:8000/kanji/n${level}`, {headers: this.headers})
  }

  /**
   * Gets phrases that may contain a certain kanji
   * 
   * @param {string} kanji - The kanji that we want to get phrases that contain it
   */
  getKanjiPhrases(kanji: string): Observable<any> {
    return this.http.get(`http://localhost:8000/dictionary/sentence/${kanji}`)
  }

  /**
   * Gets an specific Kanji Data
   * 
   * @param level - User's current level
   * @param kanji - Kanji that the user want to take a look at.
   */
  getKanji(level: number, kanji: string): Observable<any> {
    return this.http.get(`http://localhost:8000/kanji/n${level}/${kanji}`, {headers: this.headers})
  }

  /**
   * Returns the observabçe which will return the status of changes.
   * 
   * @param {object} userInfo - Current user's info.
   */
  addKanjiToKnownList(userInfo: {}): Observable<any> {
    return this.http.post(`http://localhost:8000/user/kanji/new`, userInfo,
      {headers: this.headers})
  }
}