import { Component } from '@angular/core'
import { Location } from '@angular/common'

import { LoginService } from './shared/login.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kanjibenkyo'
  constructor(private loginService: LoginService, private location: Location) {}
}
