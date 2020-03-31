import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent implements OnInit {

  levels = [
    {level: 5, passed: true, blocked: false},
    {level: 4, passed: true, blocked: false},
    {level: 3, passed: false, blocked: false},
    {level: 2, passed: false, blocked: true},
    {level: 1, passed: false, blocked: true},
  ]

  lastKanji =  {
    kanji: "都",
    kunYomi: ["みやこ"],
    onYomi: ["ト","ツ"],
    meaning: ["Metropolis","Capital"],
    examples: ["京都"],
    level: 3
  }

  constructor() { }

  ngOnInit() {
  }

}
