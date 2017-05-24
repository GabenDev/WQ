import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {User} from '../domain/user';

@Injectable()
export class UserService {
  baseUrl = "http://gaben.gleeze.com:8100/api/user"

  constructor(public http: Http) {
    console.log('UserService initialized');
  }

  public authenticate(user : User): Observable<User> {
    console.log(JSON.stringify(user));
    return this.http.post(this.baseUrl + "/auth", JSON.stringify(user), this.jwt())
      .map(res => res.json())
      .catch(this.handleError);
  }

  handleError(error) {
    console.error(error);
    alert("Error: " + error);
    return Observable.throw(error.json().error || 'Server error');
  }

  public jwt() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return new RequestOptions({ headers: headers });
  }
}
