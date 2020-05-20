import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { HeaderComponent } from './header/header.component'
import { LoginComponent } from './login/login.component'
import { NotLoggedComponent } from './home/not-logged/not-logged.component'
import { LoggedComponent } from './home/logged/logged.component'
import { FooterComponent } from './footer/footer.component'
import { SidebarComponent } from './home/sidebar/sidebar.component'
import { SignupComponent } from './signup/signup.component';
import { KanjiListComponent } from './kanji-list/kanji-list.component'
import { KanjiCardComponent } from './kanji-list/kanji-card/kanji-card.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    HeaderComponent,
    LoginComponent,
    NotLoggedComponent,
    LoggedComponent,
    FooterComponent,
    SidebarComponent,
    SignupComponent,
    KanjiListComponent,
    KanjiCardComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
