import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  dailyKanji = {
    kanji: "都",
    kunYomi: ["みやこ"],
    onYomi: ["ト","ツ"],
    meaning: ["Metropolis","Capital"],
    examples: ["京都"],
    level: 3
  }

  logged: boolean = true
  
  constructor() { }

  ngOnInit() {
  }

}
