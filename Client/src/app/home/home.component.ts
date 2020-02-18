import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  kanji = {
    kanji: "都",
    kunYomi: ["みやこ"],
    onYomi: ["ト","ツ"],
    meaning: ["Metropolis","Capital"],
    examples: ['京都'],
    level: 3
  }

  constructor() { }

  ngOnInit() {
  }

}
