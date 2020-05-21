import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/shared/login.service';
import { HttpService } from 'src/app/shared/http.service';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent implements OnInit{

  lastKanji = {kanji: '', kun_yomi: [], on_yomi: [], english: []}
  levelList: {level: number; passed: boolean; blocked: boolean}[]
  curLevel: number

  constructor(
    public loginService: LoginService,
    public httpService: HttpService
  ) { }

  ngOnInit() {
    this.levelList = this.getKanjiLevel()
    this.getLastKanji()
  }

  /**
   * Gets the current user's kanji level as well as those that it succeeded at the test
   * and those that it may not be able to study yet.
   */
  getKanjiLevel() {
    let knownKanji = this.loginService.loginInfo['kanji_known']
    let knownKanjiAmmount = knownKanji.length
    this.curLevel = 5
    let list = [
      {level: 1, passed: false, blocked: true},
      {level: 2, passed: false, blocked: true},
      {level: 3, passed: false, blocked: true},
      {level: 4, passed: false, blocked: true},
      {level: 5, passed: false, blocked: false}
    ]
    if (knownKanjiAmmount == 2202) {
      list = this.getLevelList(-1, -1, 0)
      this.curLevel = 1
    } else if(knownKanjiAmmount >= 970) {
      list = this.getLevelList(-1, 0, 0)
      this.curLevel = 2
    } else if(knownKanjiAmmount >= 603) {
      list = this.getLevelList(0, 1, 2)
      this.curLevel = 3
    } else if(knownKanjiAmmount >= 245) {
      list = this.getLevelList(1,2,3)
      this.curLevel = 4
    } else if(knownKanjiAmmount >= 79) {
      list = this.getLevelList(2,3,4)
    }
    return list
  }

  /**
   * Gets the last kanji studied by the user
   */
  getLastKanji() {
    let knownKanji = this.loginService.loginInfo['kanji_known']
    let knownKanjiAmmount = knownKanji.length
    let lastKanjiString = knownKanji.charAt(knownKanjiAmmount - 1)
    this.httpService.getKanji(this.curLevel, lastKanjiString).subscribe(kanjiData => {
      this.lastKanji = kanjiData['data'][0]
    })
  }

  /**
   * Builds the attribute levelList according to the user's current standing
   * 
   * @param firstBlocked {number} - The highest level the user can't use -1
   * @param currentLevel {number} - The current user's kanji level -1
   * @param lastPassed {number} - The last kanji level the user passed the test -1
   */
  getLevelList(firstBlocked: number,
    currentLevel: number, lastPassed: number): {level: number; passed: boolean; blocked: boolean}[] {
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
}
