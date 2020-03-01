import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'

import { LoginService } from '../shared/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  failed = false

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    // this.loginService.login(form.value).subscribe((loginData) => {
    //   if(loginData.status) {
    //     this.router.navigate(['home'])
    //     this.loginService.logged = loginData.status
    //   } else {
    //     this.failed = true
    //   }
    // })
    this.loginService.testBackend()
  }
}