import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/shared/login.service';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent {

  lastKanji =  {
    kanji: "都",
    kunYomi: ["みやこ"],
    onYomi: ["ト","ツ"],
    meaning: ["Metropolis","Capital"],
    examples: ["京都"],
    level: 3
  }

  constructor(public loginService: LoginService) { }

  /**
   * Gets the current kanji level from the user
   */
  getKanjiLevel() {
    let knownKanji = this.loginService.loginInfo['kanji_known']
    let knownKanjiAmmount = knownKanji.length
    if (knownKanjiAmmount == 1232) {
      let list = [
        {level: 5, passed: true, blocked: false},
        {level: 4, passed: true, blocked: false},
        {level: 3, passed: true, blocked: false},
        {level: 2, passed: true, blocked: false},
        {level: 1, passed: true, blocked: false},
      ]
      return list
    } else if(knownKanjiAmmount > 970) {
      let list = [
        {level: 5, passed: true, blocked: false},
        {level: 4, passed: true, blocked: false},
        {level: 3, passed: true, blocked: false},
        {level: 2, passed: true, blocked: false},
        {level: 1, passed: false, blocked: false},
      ]
      return list
    } else if(knownKanjiAmmount > 603) {
      let list = [
        {level: 5, passed: true, blocked: false},
        {level: 4, passed: true, blocked: false},
        {level: 3, passed: true, blocked: false},
        {level: 2, passed: false, blocked: false},
        {level: 1, passed: false, blocked: true},
      ]
      return list
    } else if(knownKanjiAmmount > 245) {
      let list = [
        {level: 5, passed: true, blocked: false},
        {level: 4, passed: true, blocked: false},
        {level: 3, passed: false, blocked: true},
        {level: 2, passed: false, blocked: true},
        {level: 1, passed: false, blocked: true},
      ]
      return list
    } else if(knownKanjiAmmount > 79) {
      let list = [
        {level: 5, passed: true, blocked: false},
        {level: 4, passed: false, blocked: false},
        {level: 3, passed: false, blocked: true},
        {level: 2, passed: false, blocked: true},
        {level: 1, passed: false, blocked: true},
      ]
      return list
    } else {
      let list = [
        {level: 5, passed: false, blocked: false},
        {level: 4, passed: false, blocked: true},
        {level: 3, passed: false, blocked: true},
        {level: 2, passed: false, blocked: true},
        {level: 1, passed: false, blocked: true},
      ]
      return list
    }
  }

  getLastKanji() {
    let knownKanji = this.loginService.loginInfo['kanji_known']
    console.log(knownKanji[knownKanji.length]) 
  }
}
