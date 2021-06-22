import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[UserService]
})
export class HomeComponent implements OnInit {
  public users: Array<User> = [];
  public identity: any ;
  public token:any;

  constructor(private _userService:UserService) { 
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
  }

  ngOnInit(): void {
   this.getUsers();
  }
 deleteUser(id:any){

  this._userService.delete(this.token, id).subscribe(response=>{
    if(response.status =='success'){
      this.getUsers();
    }

  },error => {console.log('Error en el servidor')});

 }
  getUsers(){
    this._userService.getUsers().subscribe(response=>{
      if(response.users){
        console.log(response.users);

        this.users=response.users;
      }

  },error=>{

  });
  }
  
}
