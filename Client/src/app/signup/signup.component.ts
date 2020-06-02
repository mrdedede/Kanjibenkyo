import { Component, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'

import { LoginService } from '../shared/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('signUpForm', null) signUpForm: NgForm
  errors: string[]
  loading: boolean
  
  constructor(public loginService: LoginService,
    private router: Router) { }

  ngOnInit() {
  }

  /**
   * This function should take the form from this component, validate it
   * and send it to login service.
   * @param form {NgForm} - Refers to the SignUp Form being exposed to the user in the moment
   */
  onSubmit(form: NgForm) {
    let curLogin = form.form.value.email
    this.errors = []
    if(form.form.pristine) {
      this.errors.push("Sorry, you can't have a user with no e-mail.")
    }
    else if(form.form.status != "INVALID") {
      if(form.value.password != form.value.passCheck) {
        this.errors.push("The passwords are not matching.")
      } else {
        this.loading = true
        this.loginService.signup(form.form.value).subscribe(response => {
          if(! response['error']) {
            this.loginService.logged = true
            this.loginService.loginInfo = response
            this.router.navigate(['./home'])
          } else {
            switch (response['error']) {
              case "Unknown Error":
                this.errors.push("Sorry, it seems like an Unknown Error has happened.")
              case "HTTP Error":
                this.errors.push(`Sorry, but it seems like your request has been rejected.
                  What about trying a stronger password?`)
              case "Connection Error":
                this.errors.push(`Sorry, it seems like we have got a connection error.
                  Please, try again later.`)
            }
          }
          this.loading = false
          setTimeout(() => {
            this.signUpForm.setValue({
              email: curLogin,
              password: "",
              passCheck: ""
            })
          })
        })
      }
    } else {
      this.errors.push("Make sure your e-mail address is valid or that every field is filled")
    }
  }
}
