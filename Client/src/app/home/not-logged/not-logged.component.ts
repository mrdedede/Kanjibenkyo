import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-not-logged',
  templateUrl: './not-logged.component.html',
  styleUrls: ['./not-logged.component.css']
})
export class NotLoggedComponent implements OnInit {

  @Input() dailyKanji: any

  matchingPasswords: boolean = true

  constructor() { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if(form.value.password != form.value.passCheck) {
      this.matchingPasswords = false
    } else {
      this.matchingPasswords = true
      alert("You should be logged now")
    }
  }
}
