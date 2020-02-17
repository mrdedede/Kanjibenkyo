import { Injectable } from "@angular/core"

import { HttpService } from "./http.service"

@Injectable({
  providedIn: "root",
})
export class LoginService {

  logged: boolean
  user: string

  constructor(private httpService: HttpService) {

  }

  login() {
    this.logged = this.httpService.mockLogin()
    this.user = "Dummy"
  }
}