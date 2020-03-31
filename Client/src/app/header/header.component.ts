import { Component, OnInit, ChangeDetectorRef, Input, OnChanges } from '@angular/core'
import { LoginService } from '../shared/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() logged: boolean

  constructor(private cdRef: ChangeDetectorRef,
    public loginService: LoginService,
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
}
