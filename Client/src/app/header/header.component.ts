import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logged: boolean = false

  constructor(private cdRef: ChangeDetectorRef,
    public loginService: LoginService) { }

  ngOnInit() {
  }

  logIn(){
    //Todo: Discover why, eventhough the variable changes its value, it won't att the header itself
    this.loginService.login().subscribe((results) => {
      this.logged = results.status
      this.cdRef.detectChanges()
    })
  }
}
