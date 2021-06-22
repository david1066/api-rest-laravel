import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [UserService]
})
export class SearchComponent implements OnInit {

  public users: User[]=[];
  public identity: any;
  public token: any;

  constructor(private _userService: UserService, private _route: ActivatedRoute) {
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
  }

  ngOnInit(): void {
    this.search();
  }
  deleteUser(id: any) {

    this._userService.delete(this.token, id).subscribe(response => {
      if (response.status == 'success') {
        this.search();
      }

    }, error => { console.log('Error en el servidor') });

  }
  search() {

    this._route.params.subscribe((params) => {
      let search = params['search'];

      this._userService.search(search).subscribe(response => {
        if (response) {
           console.log(response);
           this.users=response.search;
        }
      

      }, error => {

      });
    });


  }


}
