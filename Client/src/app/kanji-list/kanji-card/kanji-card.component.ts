import { Component, OnInit } from '@angular/core'
import { KanjiService } from 'src/app/shared/kanji.service'
import { ActivatedRoute } from '@angular/router'
import { LoginService } from 'src/app/shared/login.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-kanji-card',
  templateUrl: './kanji-card.component.html',
  styleUrls: ['./kanji-card.component.css']
})
export class KanjiCardComponent implements OnInit {
  curKanji = {kanji: '', kun_yomi: [], on_yomi: [], english: []}
  marked: boolean
  isLoading: boolean
  gotPhrase: boolean = false
  curPhrase: string
  phraseList: string[]
  phraseTranslation: string
  curPhraseIndex: number = 0

  constructor(
    public kanjiService: KanjiService,
    private activatedRoute: ActivatedRoute,
    public loginService: LoginService,
    public location: Location
    ) { }

  ngOnInit() {
    let kanjiObject = this.getKanjiString()
    let kanjiSubscription = this.kanjiService.getKanji(kanjiObject['kanji'], kanjiObject['level'])
    kanjiSubscription.subscribe(data => {
      this.curKanji = data.data[0]
      this.isStudied()
    })
  }

  /**
   * Changes the attribute 'marked' depending on whether or not the current kanji has already been
   * added to the user's studied kanji list
   */
  isStudied() {
    this.marked = false
    for(let kanji of this.loginService.loginInfo['kanji_known']){
      if(kanji == this.curKanji.kanji) {
        this.marked = true
      }
    }
  }

  /**
   * Gets kanji current level and its own representative string to facilitate searchs in the future
   * 
   * @returns {object} - An object with current kanji's level and string
   */
  getKanjiString() {
    let level = this.activatedRoute.params['_value'].level
    let kanji = this.activatedRoute.params['_value'].kanji
    return {level: level, kanji: kanji}
  }

  /**
   * Marks the current kanji as studied, as well as send its new data to firebase
   */
  markKanji() {
    this.isLoading = true
    this.loginService.loginInfo['kanji_known'] = this.loginService.loginInfo['kanji_known'] +
      this.curKanji.kanji
    this.kanjiService.updateKnownList().subscribe(data => {
      if(data){
        this.marked = true
        this.isLoading = false
      }
    })
  }

  /**
   * In the future, this will redirect the user to a test page.
   */
  takeTest() {
    console.log("This is still not implemented so far...")
  }

  /**
   * Gets an example phrase that contains the current kanji
   */
  getExamplePhrase() {
    if(this.phraseList) {
      this.curPhraseIndex ++
      this.curPhrase = this.phraseList[this.curPhraseIndex]['text']
    } else {
      let kanjiObject = this.getKanjiString()
      let kanjiSubs = this.kanjiService.getKanjiPhrases(kanjiObject['kanji'], kanjiObject['level'])
      kanjiSubs.subscribe(data => {
        this.gotPhrase = true
        this.phraseList = data.data
        this.curPhrase = data.data[0].text
        console.log(this.curPhrase)
      })
    }
  }
}
