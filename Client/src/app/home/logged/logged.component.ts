import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logged',
  templateUrl: './logged.component.html',
  styleUrls: ['./logged.component.css']
})
export class LoggedComponent implements OnInit {

  @Input() dailyKanji: any

  constructor() { }

  ngOnInit() {
  }

}
