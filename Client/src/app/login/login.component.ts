import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'

import { LoginService } from '../shared/login.service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  failed: boolean = false
  loading: boolean

  constructor(private loginService: LoginService,
    private router: Router,
    public location: Location) { }

  /**
   * This function should send data from the client to the Login Service.
   * @param form {NgForm}
   */
  onSubmit(form: NgForm) {
    this.loginService.login(form.form.value)
  }
}