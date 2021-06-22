import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { global } from './global';

@Injectable()
export class UserService {
  public url: string;
  public identity:any;
  public token:any;
  constructor(private _http: HttpClient) {
    this.url = global.url;
    this.identity=this.getIdentity();
  }
  prueba() {
    return "hosdlfs servicio";
  }

  newuser(user:any): Observable<any> {
    //convertir el objeto a un json string
    if(this.identity=='seller'){
        user.role='client';
    }

    let json = JSON.stringify(user);
    
    let params = "json=" + json;

    console.log(params);
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    //peticion ajax
    return this._http.post(this.url+'create',params,{headers:headers});
  }
  signup(user:any,getToken=null):Observable<any>{
    //comporbar si llega el gettoken

    if(getToken != null){
      user.getToken = getToken;
    }
    console.log(user);
   
    let json = JSON.stringify(user);
    let params = "json=" + json;
    let headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');


    return this._http.post(this.url+'login',params,{headers: headers});


  }

  getIdentity(){
    let identity = JSON.parse(<any>localStorage.getItem('identity'));
    if(identity && identity!=null && identity != "undefined"){
      this.identity = identity;
    }else{
      this.identity = null;

    }
    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');
    if(token && token!=null && token != "undefined"){
      this.token = token;
    }else{
      this.token = null;

    }
    return this.token;
  }

  update(user:any,id:string):Observable<any>{
  
    let json = JSON.stringify(user);
    let params = "json=" + json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').
    set('Authorization', this.getToken());
    console.log(params);
    return this._http.put(this.url+'user/update/'+id,params, {headers:headers})
  }
  getUsers():Observable<any>{
   
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').
    set('Authorization', this.getToken());
     
    return this._http.get(this.url+'users', {headers:headers});
  }
  delete(token:string, id:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').
    set('Authorization', this.getToken());
      
    return this._http.delete(this.url+'user/delete/'+id, {headers:headers});
  }
  getUser(id:string):Observable<any>{
   
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').
    set('Authorization', this.getToken());
     
    return this._http.get(this.url+'user/'+id, {headers:headers});
  }
  search(search:string):Observable<any>{
   
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').
    set('Authorization', this.getToken());
     
    return this._http.get(this.url+'user/search/'+search, {headers:headers});
  }
  
}
