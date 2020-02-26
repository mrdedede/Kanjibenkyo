import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { HeaderComponent } from './header/header.component'
import { KanjiComponent } from './kanji/kanji.component'
import { LoginComponent } from './login/login.component'
import { NotLoggedComponent } from './home/not-logged/not-logged.component'
import { LoggedComponent } from './home/logged/logged.component'

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    HeaderComponent,
    KanjiComponent,
    LoginComponent,
    NotLoggedComponent,
    LoggedComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true}
    ),
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
