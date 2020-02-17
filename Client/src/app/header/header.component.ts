import { Component, OnInit } from '@angular/core';

import { LoginService } from '../shared/login.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logged: boolean

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  logIn(){
    this.loginService.login()
    this.logged = this.loginService.logged
  }
}
