import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'

import { LoginService } from '../shared/login.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  errors: string[]
  loading: boolean
  
  constructor(public loginService: LoginService) { }

  ngOnInit() {
  }

  /**
   * This function should take the form from this component, validate it
   * and send it to login service.
   * @param form {NgForm} - Refers to the SignUp Form being exposed to the user in the moment
   */
  async onSubmit(form: NgForm) {
    this.errors = []
    if(form.form.pristine) {
      this.errors.push("An empty form can't be sent.")
    }
    else if(form.form.status != "INVALID") {
      if(form.value.password != form.value.passCheck) {
        this.errors.push("The passwords are not matching.")
      } else {
        this.loading = true
        let response = await this.loginService.signup(form.form.value).toPromise()
        // We should transform it into an observable sooner or later.
        if(! response['error']) {
          this.loginService.logged = true
        } else {
          this.errors.push("Your inputs are not valid. Please try again")
        }
        this.loading = false
      }
    } else {
      this.errors.push("Make sure your e-mail address is valid or that every field is filled")
    }
  }
}
