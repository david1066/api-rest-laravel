import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';




@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public page_title: string;
  public user: User;
  public status: any;
  public identity:any;
  public token: any;

  constructor(private _userService: UserService,
    private _router:Router, _route: ActivatedRoute) {
    this.page_title = 'Identificate';
    this.user = new User('', '', '', '', '', '', '','','');
  }

  ngOnInit() {
  }
  onSubmit(form:any) {

    this._userService.signup(this.user).subscribe(
      response => {
        //devuelve el token
        if (response.status != 'error') {
          this.status = 'success';
          this.token = response;

          //objeto usuario identificado
          this._userService.signup(this.user, <any>true).subscribe(
            response => {
              //devuelve el token
              this.identity = response;

              console.log(this.token);
              console.log(this.identity);
              //persistir datos usuario identificado
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));
              //redireccion
              this._router.navigate(['inicio']);
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }

          );

        } else {
          this.status = 'error';
          console.log('error');
        }


      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }

    );

  }

}
