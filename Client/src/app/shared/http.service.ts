import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class HttpService {

  constructor() {

  }

  mockLogin(){
    return true
  }
}