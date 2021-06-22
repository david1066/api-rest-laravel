import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { appRoutingProviders, routing } from './app.routing';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './services/user.service';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NewUserComponent,
    UpdateUserComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
  ],
  providers: [appRoutingProviders, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
