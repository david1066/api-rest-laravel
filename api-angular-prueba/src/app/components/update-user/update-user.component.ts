import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: '../new-user/new-user.component.html',
  styleUrls: ['./update-user.component.css'],
  providers: [UserService]
})
export class UpdateUserComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status: any;
  public identity: any;


  constructor(private _userService: UserService, private _route: ActivatedRoute, private _router: Router) {
    this.page_title = 'Actualizar';
    this.user = new User('', '', '', '', '', '', '', '', '');
  
    this.identity = _userService.getIdentity();
  }

  ngOnInit() {
    
    this.getUser();
  }

  getUser() {

    this._route.params.subscribe((params) => {
      let id = params['id'];
      this._userService.getUser(id).subscribe(response => {
        if (response.user) {

          
          console.log(response.user);

          this.user = response.user;
        }
      

      }, error => {
        console.log(error);
      });
  });
}
  
  onSubmit(form: any) {

   

    this._userService.update(this.user,this.user.id).subscribe(
      response => {
        if (response.user) {
          this.status = 'success';
          this._router.navigate(['/home']);
        } else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';

      }
    );
  }
}
