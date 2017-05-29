import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {User} from '../domain/user';

@Injectable()
export class UserService {
  //baseUrl = "http://localhost:8001/user";
  baseUrl = "http://gaben.gleeze.com:8001/user";

  private accessToken : string;
  private idToken : string;

  constructor(public http: Http) {
    console.log('UserService initialized');
  }

  public authenticate(user : User): Observable<any> {
    console.log(JSON.stringify(user));
    return this.http.post(this.baseUrl + "/auth", JSON.stringify(user), this.simpleJwt())
      .map(res => res.json())
      .catch(this.handleError);
  }

  handleError(error) {
    console.error(error);
    alert("Error: " + error);
    return Observable.throw(error.json().error || 'Server error');
  }

  public simpleJwt() {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return new RequestOptions({ headers: headers });
  }

  public jwt() {
    let headers = new Headers({
      'Content-Type': 'application/json', 'Authorization' : 'Bearer ' + this.accessToken
    });
    return new RequestOptions({ headers: headers });
  }

  public setIdToken(idToken : string) {
    this.idToken = idToken;
  }

  public setAccessToken(accessToken : string) {
    this.accessToken = accessToken;
  }

  public getIdToken() {
    return this.idToken;
  }

  public getAccessToken() {
    return this.accessToken;
  }

}
