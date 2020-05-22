import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/shared/login.service';
import { HttpService } from 'src/app/shared/http.service';
import { KanjiService } from 'src/app/shared/kanji.service';

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
    public httpService: HttpService,
    public kanjiService: KanjiService
  ) { }

  ngOnInit() {
    this.levelList = this.kanjiService.getKanjiLevelList()
    this.curLevel = this.kanjiService.getCurMaxLevel()
    this.getLastKanji()
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
}
