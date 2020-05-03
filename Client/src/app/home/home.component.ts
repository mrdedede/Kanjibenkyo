import { Component, OnInit, OnChanges } from '@angular/core'
import { LoginService } from '../shared/login.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public loginService: LoginService) {}

  /**
   * Gets the login status directly from loginService
   */
  isLogged() {
    return this.loginService.logged
  }
}
