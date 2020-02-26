import { Component, OnInit, OnChanges } from '@angular/core'
import { LoginService } from '../shared/login.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dailyKanji = {
    kanji: "都",
    kunYomi: ["みやこ"],
    onYomi: ["ト","ツ"],
    meaning: ["Metropolis","Capital"],
    examples: ["京都"],
    level: 3
  }

  logged: boolean

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.logged = this.loginService.logged
  }

}
