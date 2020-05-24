import { Injectable } from '@angular/core'
import { HttpService } from './http.service'
import { LoginService } from './login.service'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class KanjiService {
  curMaxLevel: number

  constructor(
    public httpService: HttpService,
    public loginService: LoginService
    ) {}

  /**
   * Gets the current user's kanji level as well as those that it succeeded at the test
   * and those that it may not be able to study yet.
   * 
   * @returns The list of levels
   */
  getKanjiLevelList() {
    let knownKanji = this.loginService.loginInfo['kanji_known']
    let knownKanjiAmmount = knownKanji.length
    this.curMaxLevel = 5
    let list = [
      {level: 1, passed: false, blocked: true},
      {level: 2, passed: false, blocked: true},
      {level: 3, passed: false, blocked: true},
      {level: 4, passed: false, blocked: true},
      {level: 5, passed: false, blocked: false}
    ]
    if (knownKanjiAmmount == 2202) {
      list = this.getLevelList(-1, -1, 0)
      this.curMaxLevel = 1
    } else if(knownKanjiAmmount >= 970) {
      list = this.getLevelList(-1, 0, 0)
      this.curMaxLevel = 2
    } else if(knownKanjiAmmount >= 603) {
      list = this.getLevelList(0, 1, 2)
      this.curMaxLevel = 3
    } else if(knownKanjiAmmount >= 245) {
      list = this.getLevelList(1,2,3)
      this.curMaxLevel = 4
    } else if(knownKanjiAmmount >= 79) {
      list = this.getLevelList(2,3,4)
    }
    return list
  }

  /**
   * Builds the attribute levelList according to the user's current standing
   * 
   * @param {number} firstBlocked - The highest level the user can't use -1
   * @param {number} currentLevel - The current user's kanji level -1
   * @param {number} lastPassed - The last kanji level the user passed the test -1
   */
  getLevelList(firstBlocked: number, currentLevel: number,
    lastPassed: number): {level: number; passed: boolean; blocked: boolean}[] {
    let list = []
    for(let i = 0; i <= 4; i++) {
      if(i <= firstBlocked) {
        list[i] = {level: i+1, passed: false, blocked: true}
      } else if(i == currentLevel) {
        list[i] = {level: i+1, passed: false, blocked: false}
      } else if(i >= lastPassed) {
        list[i] = {level: i+1, passed: true, blocked: false}
      }
    }
    return list
  }
  
  /**
   * Gets a phrase in which there is the search kanji within
   *  
   * @param {string} kanji - Kanji we are searching for phrases
   * @param {number} curLevel - Level of the kanji we're searching for
   * 
   * @returns {Observable} - The Observable that may return the phrase data
   */
  getKanjiPhrases(kanji: string, curLevel?: number): Observable<any> {
    if(!curLevel) {
      curLevel = this.curMaxLevel
    }
    return this.httpService.getKanjiPhrases(kanji)
  }

  /**
   * Gets kanji info
   * 
   * @param {string} kanji - Kanji we're searching for info
   * @param {number} curLevel - Level of the kanji we're searching for
   * 
   * @returns {Observable} - The Observable that may return the kanji data
   */
  getKanji(kanji: string, curLevel?: number): Observable<any> {
    if(!curLevel) {
      curLevel = this.curMaxLevel
    }
    return this.httpService.getKanji(curLevel, kanji)
  }

  /**
   * returns the current level of the user
   * 
   * @returns {number} - User's level
   */
  getCurMaxLevel(): number {
    return this.curMaxLevel
  }

  /**
   * Returns the observable that confirms the addition of a kanji to its list.
   * 
   * @returns {Observable} - The Observable that will confirm the change.
   */
  updateKnownList() {
    return this.httpService.addKanjiToKnownList(this.loginService.loginInfo)
  }
}