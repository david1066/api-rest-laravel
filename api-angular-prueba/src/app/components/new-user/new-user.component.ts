import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  providers: [UserService]
})
export class NewUserComponent implements OnInit {

  public page_title:string;
  public user: User;
  public status: any;
  public identity: any;

  
  constructor(private _userService: UserService) {
    this.page_title='Registrate';
    this.user = new User('','','','','','','','','');
    this.identity= _userService.getIdentity();

  }

  ngOnInit() {
   console.log(this._userService.prueba());
  }
  onSubmit(form:any){

    if(this.identity.role=='seller'){
      this.user.role='client';
    }
 

     this._userService.newuser(this.user).subscribe(
      response=>{
        if(response.user){
          this.status= 'success';
          form.reset();
        }else{
          this.status='error';
        }
      },
      error=>{
        this.status='error';

      }
    ); 
  }

}
