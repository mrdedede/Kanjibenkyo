import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { HttpService } from '../shared/http.service'
import { LoginService } from '../shared/login.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-kanji-list',
  templateUrl: './kanji-list.component.html',
  styleUrls: ['./kanji-list.component.css']
})
export class KanjiListComponent implements OnInit {
  kanjiList = []
  curLevel: number
  isLoading: boolean

  constructor(
    private activatedRoute: ActivatedRoute,
    public httpService:HttpService,
    public loginService:LoginService,
    public location: Location
    ) { }
  
  ngOnInit() {
    this.curLevel = this.getLevel()
    this.isLoading = true
    this.httpService.getKanjiLevel(this.curLevel).subscribe(data => {
      this.kanjiList = data.data
      this.isLoading = false
    })
  }

  getLevel() {
    return this.activatedRoute.params['_value'].level
  }
}
