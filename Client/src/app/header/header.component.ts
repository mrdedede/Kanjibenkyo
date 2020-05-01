import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { LoginService } from '../shared/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() logged: boolean

  constructor( public loginService: LoginService,
    public router: Router) { }

  ngOnInit() {
    this.logged = this.loginService.logged
  }

  ngOnChanges() {
    this.logged = this.loginService.logged
  }

  /**
   * This function will route the user to the login page
   */
  logIn(){
    this.router.navigate(['login'])
  }

  /**
   * This function will just clear all user data from the cliente
   */
  logOut() {
    this.loginService.logOut()
    this.router.navigate(['./home'])
  }
}
