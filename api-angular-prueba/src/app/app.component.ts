import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public identity: any;
  public token:any;
  public search:string ='';

  constructor(private _userService:UserService,private _router:Router,){
    this.identity=_userService.getIdentity();
  }
  logout(){
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/inicio']);
  }

  goSearch(){
  
    this._router.navigate(['/busqueda',this.search]);
  }

  
}
