import { Component, OnInit, OnChanges } from '@angular/core'
import { LoginService } from '../shared/login.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  logged: boolean

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.logged = this.loginService.logged
  }

}
