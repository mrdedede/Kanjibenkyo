import { Component, OnInit } from '@angular/core';
import { KanjiService } from 'src/app/shared/kanji.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/shared/login.service';

@Component({
  selector: 'app-kanji-card',
  templateUrl: './kanji-card.component.html',
  styleUrls: ['./kanji-card.component.css']
})
export class KanjiCardComponent implements OnInit {
  curKanji = {kanji: '', kun_yomi: [], on_yomi: [], english: []}

  constructor(
    public kanjiService: KanjiService,
    private activatedRoute: ActivatedRoute,
    public loginService: LoginService) { }

  ngOnInit() {
    let kanjiObject = this.getKanjiString()
    let kanjiObservable = this.kanjiService.getKanji(kanjiObject['kanji'], kanjiObject['level'])
    kanjiObservable.subscribe(data => {
      this.curKanji = data.data[0]
    })
  }

  getKanjiString() {
    let level = this.activatedRoute.params['_value'].level
    let kanji = this.activatedRoute.params['_value'].kanji
    return {level: level, kanji: kanji}
  }
}
