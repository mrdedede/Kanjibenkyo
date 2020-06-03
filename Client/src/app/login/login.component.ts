import { Component, OnInit, ViewChild } from '@angular/core'
import { NgForm, NgModel } from '@angular/forms'

import { LoginService } from '../shared/login.service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('loginForm', null) loginForm: NgForm
  failed: boolean = false
  loading: boolean
  errormsg: string

  constructor(
    public loginService: LoginService,
    private router: Router,
    public location: Location) { }

  /**
   * This function should send data from the client to the Login Service.
   * @param form {NgForm}
   */
  onSubmit(form: NgForm) {
    let curLogin = form.form.value.email
    this.loading = true
    this.loginService.login(form.form.value).subscribe(response => {
      if(! response['error']) {
        this.loginService.logged = true
        this.loginService.loginInfo = response
        this.router.navigate(['./home'])
      } else {
        this.failed = true
        switch (response['error']) {
          case "Unknown Error":
            this.errormsg = "Sorry, it seems like an Unknown Error has happened."
          case "HTTP Error":
            this.errormsg = `Sorry, but it seems like you inserted some wrong information.`
          case "Connection Error":
            this.errormsg = `Sorry, it seems like we have got a connection error.
              Please, try again later.`
          case "Wrong Password":
            this.errormsg = 
            `Sorry, but we couldn't find your e-mail address or your password is wrong.`
        }
      }
      this.loading = false
      setTimeout(() => {
        this.loginForm.setValue({
          email: curLogin,
          password: ""
        })
      })
      console.log(form)
    })
  }
}